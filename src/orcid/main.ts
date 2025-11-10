import { buildResearchCard } from "./research-card.js";
import { Orcid, Work, WorkSummary } from "orcid-parser";
import { WORK_TYPES, WorkType } from "orcid-parser/constants";

export const WORK_CATEGORIES = ["publications", "conferences", "softwares", "services", "others"] as const;
export type WorkCategory = typeof WORK_CATEGORIES[number];

export type WorkItem = {
  title: string;
  subtitle: string;
  url?: string;
  type: string | null;
  category: WorkCategory;
  authors?: string;
  publicationYear?: number;
  publicationMonth?: number;
  publicationDay?: number;
  index?: number;
  isStatic: boolean;
};

let client = new Orcid("0000-0002-5636-8870");
let works: Record<WorkCategory, WorkItem[]> | null = null;

export function emptyWorks(): Record<WorkCategory, WorkItem[]> {
  return {
    publications: [],
    conferences: [],
    softwares: [],
    services: [],
    others: [],
  };
}

function extractStaticWorks(): Record<WorkCategory, WorkItem[]> {
  const staticWorks = emptyWorks();
  document.querySelectorAll<HTMLElement>("[data-static-works]").forEach(container => {
    const category = container.dataset.staticWorks as WorkCategory | undefined;
    if (!category || !staticWorks[category]) return;
    container.querySelectorAll<HTMLElement>("[data-work]").forEach(item => {
      const entry = item.dataset;
      const workType =
        entry.workType == "academic-service" ? "academic-service" : WORK_TYPES[(entry.workType as keyof typeof WORK_TYPES) || "UNSUPPORTED"];
      const category = mapOrcidTypeToCategory(workType);

      staticWorks[category].push({
        title: entry.workTitle || "",
        subtitle: entry.workSubtitle || "",
        url: entry.workUrl || undefined,
        type: workType,
        category,
        authors: entry.workAuthors || undefined,
        publicationYear: parseInt(entry.workYear || "1"),
        publicationMonth: parseInt(entry.workYear || "1"),
        publicationDay: parseInt(entry.workYear || "1"),
        isStatic: true,
      });
    });
  });
  return staticWorks;
}

function mapOrcidTypeToCategory(type: string | null): WorkCategory {
  switch (type) {
    case WORK_TYPES.ARTICLE:
    case WORK_TYPES.CONFERENCE_PAPER:
    case WORK_TYPES.CONFERENCE_PROCEEDINGS:
    case WORK_TYPES.BOOK:
    case WORK_TYPES.BOOK_CHAPTER:
    case WORK_TYPES.PREPRINT:
      return "publications";
    case WORK_TYPES.CONFERENCE_PRESENTATION:
    case WORK_TYPES.CONFERENCE_POSTER:
    case WORK_TYPES.CONFERENCE_OUTPUT:
      return "conferences";
    case WORK_TYPES.SOFTWARE:
      return "softwares";
    case "academic-service":
      return "services";
    default:
      return "others";
  }
}

function workTypeToString(workType: WorkType): string {
  const str = workType.replace("-", " ");
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function parseORCIDWorks(works: Work[]): Record<WorkCategory, WorkItem[]> {
  const parsedWorks = emptyWorks();
  works.forEach(work => {
    const category = mapOrcidTypeToCategory(work.type);
    const type = WorkType.fromString(work.type || "");

    parsedWorks[category].push({
      ...work,
      category,
      subtitle: (work.journalTitle || "") + ", " + (work.publicationYear || "") + " | " + WorkType.format(type),
      authors: work.contributors?.map((c) => c.name || "").join(", ") || "",
      isStatic: false,
    });
  });
  return parsedWorks;
}

function mergeWorks(
  orcid: Record<WorkCategory, WorkItem[]>,
  staticWorks: Record<WorkCategory, WorkItem[]>
): Record<WorkCategory, WorkItem[]> {
  const merged = emptyWorks();

  for (const key of Object.keys({ ...orcid, ...staticWorks }) as WorkCategory[]) {
    merged[key] = [...(orcid[key] || []), ...(staticWorks[key] || [])];
  }

  return merged;
}

export async function populateResearchCard(retry = 0): Promise<Record<WorkCategory, WorkItem[]>> {
  const staticWorks = extractStaticWorks();

  // Return cached works if available
  if (works) {
    return works;
  }

  // Populate with static works immediately
  buildResearchCard(staticWorks);

  const data = await client.getWorks();
  if (!data) {
    if (retry < 2) {
      // Wait 500ms and retry
      await new Promise(resolve => setTimeout(resolve, 500));
      return populateResearchCard(retry + 1);
    }
    console.warn("ORCID fetch failed — showing static works only.");
    works = staticWorks;
    return works;
  }

  works = mergeWorks(parseORCIDWorks(data), staticWorks);
  buildResearchCard(works);
  return works;
}

async function initialize() {
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", () => populateResearchCard())
    : populateResearchCard();
}

initialize();


