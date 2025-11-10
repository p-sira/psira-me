import type { WorkItem, WorkCategory } from "./main.js";

function sortWorks(a: WorkItem, b: WorkItem) {
  const indexA = a.index ?? 9999;
  const indexB = b.index ?? 9999;
  if (indexA !== indexB) return indexA - indexB;
  const yearA = typeof a.year === "number" ? a.year : parseInt(a.subtitle.match(/\d{4}/)?.[0] || "0");
  const yearB = typeof b.year === "number" ? b.year : parseInt(b.subtitle.match(/\d{4}/)?.[0] || "0");
  return yearB - yearA;
}

export function createWorkElement(work: WorkItem) {
  const div = document.createElement("div");
  div.className = `border-l-4 border-primary pl-4`;
  const yearStr = typeof work.year === "number" && work.year !== 9999 ? work.year.toString() : "";
  const meta = work.subtitle
    ? escapeHtml(work.subtitle)
    : (yearStr ? escapeHtml(yearStr) : "");
  const authors = work.authors ? `<p class="text-secondary">${escapeHtml(work.authors)}</p>` : "";
  div.innerHTML = `
    <h4 class="text-lg font-semibold text-primary mb-2">
      ${work.url
      ? `<a href="${escapeHtml(work.url)}" target="_blank" rel="noopener noreferrer" class="hover:underline">${escapeHtml(work.title)}</a>`
      : escapeHtml(work.title)}
    </h4>
    <div class="flex items-center gap-2 mb-2">
      ${meta ? `<p class="text-secondary">${meta}</p>` : ""}
    </div>
    ${authors}
  `;
  return div;
}

export function populateResearchCard(allWorks: Record<WorkCategory, WorkItem[]>) {
  const categories: WorkCategory[] = ["publications", "conferences", "services"];
  return categories.some(cat => populateTab(cat, allWorks[cat] || []));
}

function populateTab(category: WorkCategory, works: WorkItem[]) {
  const tab = document.getElementById(`${category}-tab`);
  if (!tab) return false;
  const container = tab.querySelector(".space-y-6");
  if (!container) return false;

  (container.querySelectorAll(".border-l-4:not([data-work])") as NodeListOf<HTMLElement>).forEach(el => el.remove());
  (container.querySelectorAll("p.text-secondary") as NodeListOf<HTMLParagraphElement>).forEach(p => {
    if (p.textContent && p.textContent.trim() === "No items found.") p.remove();
  });

  const staticItems = Array.from(container.querySelectorAll("[data-work]"));
  if (works.length === 0 && staticItems.length === 0) {
    (container as HTMLElement).innerHTML = `<p class="text-secondary">No items found.</p>`;
    return true;
  }

  for (const w of works) {
    const elem = createWorkElement(w);
    staticItems.length ? container.insertBefore(elem, staticItems[0]) : container.appendChild(elem);
  }
  return true;
}

export function observeResearchCard(
  cachedWorks: Record<WorkCategory, WorkItem[]> | null,
  loadORCIDData: () => void,
  extractStaticWorks: () => Record<WorkCategory, WorkItem[]>
) {
  const card = document.getElementById("research-card");
  if (!card) return;

  new MutationObserver(mutations => {
    for (const m of mutations) {
      if (m.type === "attributes" && m.attributeName === "aria-hidden") {
        const visible = card.getAttribute("aria-hidden") === "false";
        if (!visible) continue;
        const staticWorks = extractStaticWorks();
        const merged = mergeWorks(cachedWorks || emptyWorks(), staticWorks);
        populateResearchCard(merged);
        if (!cachedWorks) loadORCIDData();
      }
    }
  }).observe(card, { attributes: true, attributeFilter: ["aria-hidden"] });
}

function emptyWorks(): Record<WorkCategory, WorkItem[]> {
  return { publications: [], conferences: [], services: [] };
}

function escapeHtml(text = "") {
  const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function mergeWorks(
  a: Record<WorkCategory, WorkItem[]>,
  b: Record<WorkCategory, WorkItem[]>
): Record<WorkCategory, WorkItem[]> {
  return {
    publications: [...(a.publications || []), ...(b.publications || [])],
    conferences: [...(a.conferences || []), ...(b.conferences || [])],
    services: [...(a.services || []), ...(b.services || [])]
  };
}

function buildCitation(work: WorkItem): string {
  const parts: string[] = [];
  if (work.authors) parts.push(work.authors.trim().replace(/\.?$/, "."));
  parts.push(work.title.trim().replace(/\.?$/, "."));
  const yearStr = typeof work.year === "number" && work.year !== 9999 ? work.year.toString() : "";
  const venue = [work.subtitle, yearStr].filter(Boolean).join(", ");
  if (venue) parts.push(venue.trim().replace(/\.?$/, "."));
  if (work.url) parts.push(work.url);
  return parts.join(" ");
}


