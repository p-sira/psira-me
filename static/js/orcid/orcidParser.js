import { ORCID_URL, CONFIG } from "./config.js";

export async function fetchORCIDData() {
  try {
    const response = await fetch(ORCID_URL, {
      headers: { Accept: "application/orcid+json" }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching ORCID data:", error);
    return null;
  }
}

export function mapWork(work) {
  if (!work || !work['work-type']) return { category: 'other', type: 'Other' };

  const type = work['work-type'];
  let category = 'other';
  let formattedName = 'Other';

  switch (type) {
    // --- Publications ---
    case 'journal-article':
    case 'book-chapter':
    case 'book':
    case 'edited-book':
    case 'magazine-article':
    case 'newspaper-article':
    case 'online-resource':
    case 'report':
      category = 'publications';
      break;

    // --- Conferences ---
    case 'conference-paper':
    case 'conference-abstract':
    case 'conference-poster':
    case 'conference-proceedings':
      category = 'conferences';
      break;

    // --- Services ---
    case 'review':
    case 'peer-review':
    case 'editorial':
    case 'supervision':
      category = 'services';
      break;
  }

  formattedName = type
    .split('-')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');

  return {
    ...work,
    category,
    formattedName
  };
}


export function extractWorks(orcidData) {
  const works = { publications: [], conferences: [], services: [] };
  if (!orcidData) return works;

  const groups = orcidData.group
    ? (Array.isArray(orcidData.group) ? orcidData.group : [orcidData.group])
    : (orcidData["work-summary"] ? [{ "work-summary": orcidData["work-summary"] }] : []);

  for (const group of groups) {
    const summaries = Array.isArray(group["work-summary"]) ? group["work-summary"] : [group["work-summary"]];
    for (const w of summaries) {
      const work = buildWorkObject(w, works);
      if (work) works[work.category].push(work);
    }
  }

  for (const cat in works) works[cat].sort(sortWorks);
  return works;
}

function buildWorkObject(summary, worksByCategory) {
  const type = summary.type?.value || "other";
  const category = getWorkCategory(type);
  const year = summary["publication-date"]?.year?.value || null;
  const title = summary.title?.title?.value || "Untitled";
  const subtitle = buildSubtitle(summary, year);
  const description = extractDescription(summary);
  const url = extractURL(summary);
  const borderColor = CONFIG.BORDER_COLORS[worksByCategory[category].length % CONFIG.BORDER_COLORS.length];

  return {
    title, subtitle, description, borderColor, url,
    displayIndex: parseInt(summary["display-index"]?.value || "999999"),
    type, category
  };
}

function getWorkCategory(type) {
  for (const [cat, list] of Object.entries(CONFIG.WORK_TYPE_MAPPINGS)) {
    if (list.includes(type)) return cat;
  }
  return "publications";
}

function buildSubtitle(summary, year) {
  const journal = summary["journal-title"]?.value;
  if (journal && year) return `${journal}, ${year}`;
  return journal || year || "";
}

function extractDescription(w) {
  return w.citation?.["citation-value"] || w["short-description"] || "Published research work";
}

function extractURL(w) {
  const ids = w["external-ids"]?.["external-id"];
  if (!ids) return null;
  const list = Array.isArray(ids) ? ids : [ids];
  for (const id of list) {
    const url = id["external-id-url"]?.value;
    if (url && ["doi", "url"].includes(id["external-id-type"])) return url;
  }
  return null;
}

function sortWorks(a, b) {
  if (a.displayIndex !== b.displayIndex) return a.displayIndex - b.displayIndex;
  const yearA = parseInt(a.subtitle.match(/\d{4}/)?.[0] || "0");
  const yearB = parseInt(b.subtitle.match(/\d{4}/)?.[0] || "0");
  return yearB - yearA;
}

export function extractStaticWorks() {
  const staticWorks = { publications: [], conferences: [], services: [] };
  document.querySelectorAll("[data-static-works]").forEach(container => {
    const category = container.dataset.staticWorks;
    if (!staticWorks[category]) return;
    container.querySelectorAll("[data-work]").forEach(item => {
      staticWorks[category].push({
        title: item.dataset.workTitle || "",
        subtitle: item.dataset.workSubtitle || "",
        description: item.dataset.workDescription || "",
        borderColor: item.dataset.workBorderColor || CONFIG.BORDER_COLORS[0],
        url: item.dataset.workUrl || null,
        displayIndex: parseInt(item.dataset.workIndex || "999999"),
        category, isStatic: true
      });
    });
  });
  for (const cat in staticWorks) staticWorks[cat].sort(sortWorks);
  return staticWorks;
}

export function mergeWorks(orcid, staticWorks) {
  return {
    publications: [...orcid.publications, ...staticWorks.publications],
    conferences: [...orcid.conferences, ...staticWorks.conferences],
    services: [...orcid.services, ...staticWorks.services]
  };
}
