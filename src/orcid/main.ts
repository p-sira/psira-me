import { populateResearchCard, observeResearchCard } from "./research-card.js";
import { ORCID, WORK_TYPES } from "orcid-parser";

type WorkCategory = "publications" | "conferences" | "services";

export interface WorkItem {
  title: string;
  subtitle: string;
  url: string | null;
  displayIndex: number;
  type?: string;
  category?: WorkCategory;
  isStatic?: boolean;
  borderColor?: string;
  authors?: string;
  journal?: string;
  year?: string;
}

let client = new ORCID("0000-0002-5636-8870");
let cachedWorks: Record<WorkCategory, WorkItem[]> | null = null;

function sortWorks(a: WorkItem, b: WorkItem) {
  if (a.displayIndex !== b.displayIndex) return a.displayIndex - b.displayIndex;
  const yearA = parseInt(a.subtitle.match(/\d{4}/)?.[0] || "0");
  const yearB = parseInt(b.subtitle.match(/\d{4}/)?.[0] || "0");
  return yearB - yearA;
}

function extractStaticWorks(): Record<WorkCategory, WorkItem[]> {
  const staticWorks: Record<WorkCategory, WorkItem[]> = {
    publications: [],
    conferences: [],
    services: []
  };
  document.querySelectorAll<HTMLElement>("[data-static-works]").forEach(container => {
    const category = container.dataset.staticWorks as WorkCategory | undefined;
    if (!category || !staticWorks[category]) return;
    container.querySelectorAll<HTMLElement>("[data-work]").forEach(item => {
      const subtitle = item.dataset.workSubtitle || "";
      const { journal, year } = parseSubtitle(subtitle);
      staticWorks[category].push({
        title: item.dataset.workTitle || "",
        subtitle,
        url: item.dataset.workUrl || null,
        displayIndex: parseInt(item.dataset.workIndex || "999999"),
        category,
        isStatic: true,
        borderColor: item.dataset.workBorderColor,
        authors: item.dataset.workDescription || undefined,
        journal,
        year
      });
    });
  });
  for (const cat in staticWorks) staticWorks[cat as WorkCategory].sort(sortWorks);
  return staticWorks;
}

function mapOrcidTypeToCategory(type: string | undefined): WorkCategory {
  switch (type) {
    case WORK_TYPES.ARTICLE:
    case WORK_TYPES.BOOK:
    case WORK_TYPES.BOOK_CHAPTER:
    case WORK_TYPES.PREPRINT:
      return "publications";
    case WORK_TYPES.CONFERENCE_PAPER:
    case WORK_TYPES.CONFERENCE_ABSTRACT:
      return "conferences";
    default:
      return "services";
  }
}

function buildSubtitle(summary: any, year: string | null): string {
  const journal: string | undefined = summary?.["journal-title"]?.value;
  if (journal && year) return `${journal}, ${year}`;
  return journal || year || "";
}

function parseSubtitle(subtitle: string): { journal?: string; year?: string } {
  const yearMatch = subtitle.match(/(\d{4})(?!.*\d)/);
  const year = yearMatch ? yearMatch[1] : undefined;
  let journal = subtitle;
  if (year) {
    // Remove trailing ", YEAR" or just YEAR
    journal = journal.replace(new RegExp(`(?:,\s*)?${year}$`), "").trim();
  }
  return {
    journal: journal || undefined,
    year
  };
}

function buildWorkItem(summary: any): WorkItem {
  const type: string = summary?.type?.value || "other";
  const category = mapOrcidTypeToCategory(type);
  const year = summary?.["publication-date"]?.year?.value || null;
  const title: string = summary?.title?.title?.value || "Untitled";
  const subtitle = buildSubtitle(summary, year);
  const url = extractURL(summary);
  return {
    title,
    subtitle,
    url,
    displayIndex: parseInt(summary?.["display-index"]?.value || "999999"),
    type,
    category,
    journal: summary?.["journal-title"]?.value || undefined,
    year: year || undefined
  };
}

function extractURL(summary: any): string | null {
  const ids = summary?.["external-ids"]?.["external-id"];
  if (!ids) return null;
  const list = Array.isArray(ids) ? ids : [ids];
  for (const id of list) {
    const url: string | undefined = id?.["external-id-url"]?.value;
    if (url && ["doi", "url"].includes(id?.["external-id-type"])) return url;
  }
  return null;
}

function extractWorks(data: any): Record<WorkCategory, WorkItem[]> {
  const byCat: Record<WorkCategory, WorkItem[]> = {
    publications: [],
    conferences: [],
    services: []
  };
  const groups = data?.group || [];
  for (const g of groups) {
    const summaries = g?.["work-summary"] || [];
    for (const s of summaries) {
      const item = buildWorkItem(s);
      byCat[item.category || "services"].push(item);
    }
  }
  for (const cat in byCat) byCat[cat as WorkCategory].sort(sortWorks);
  return byCat;
}

async function loadORCIDData(retry = 0) {
  const staticWorks = extractStaticWorks();

  if (cachedWorks) {
    populateResearchCard(mergeWorks(cachedWorks, staticWorks));
    return;
  }

  const data = await client.fetchWorks();
  if (!data) {
    if (retry < 2) return setTimeout(() => loadORCIDData(retry + 1), 500);
    console.warn("ORCID fetch failed — showing static works only.");
    populateResearchCard(staticWorks);
    return;
  }

  cachedWorks = extractWorks(data);
  populateResearchCard(mergeWorks(cachedWorks, staticWorks));
}

export function mergeWorks(
  orcid: Record<WorkCategory, WorkItem[]>,
  staticWorks: Record<WorkCategory, WorkItem[]>
) {
  return {
    publications: [...orcid.publications, ...staticWorks.publications],
    conferences: [...orcid.conferences, ...staticWorks.conferences],
    services: [...orcid.services, ...staticWorks.services]
  };
}

function initialize() {
  const start = () => {
    setTimeout(loadORCIDData, 200);
    setTimeout(() => observeResearchCard(cachedWorks, loadORCIDData, extractStaticWorks), 500);
  };
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", start)
    : start();
}

initialize();


