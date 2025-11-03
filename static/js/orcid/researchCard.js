import { mergeWorks } from "./orcidParser.js";

export function createWorkElement(work) {
  const div = document.createElement("div");
  div.className = `border-l-4 border-${work.borderColor} pl-4`;
  div.innerHTML = `
    <h4 class="text-lg font-semibold text-primary mb-2">
      ${work.url
        ? `<a href="${escapeHtml(work.url)}" target="_blank" rel="noopener noreferrer" class="hover:underline">${escapeHtml(work.title)}</a>`
        : escapeHtml(work.title)}
    </h4>
    ${work.subtitle ? `<p class="text-secondary mb-2">${escapeHtml(work.subtitle)}</p>` : ""}
    ${work.description ? `<p class="text-tertiary">${escapeHtml(work.description)}</p>` : ""}
  `;
  return div;
}

export function populateResearchCard(allWorks) {
  const categories = ["publications", "conferences", "services"];
  return categories.some(cat => populateTab(cat, allWorks[cat]));
}

function populateTab(category, works) {
  const tab = document.getElementById(`${category}-tab`);
  if (!tab) return false;
  const container = tab.querySelector(".space-y-6");
  if (!container) return false;

  container.querySelectorAll(".border-l-4:not([data-work])").forEach(el => el.remove());
  container.querySelectorAll("p.text-secondary").forEach(p => {
    if (p.textContent.trim() === "No items found.") p.remove();
  });

  const staticItems = Array.from(container.querySelectorAll("[data-work]"));
  if (works.length === 0 && staticItems.length === 0) {
    container.innerHTML = `<p class="text-secondary">No items found.</p>`;
    return true;
  }

  for (const w of works) {
    const el = createWorkElement(w);
    staticItems.length ? container.insertBefore(el, staticItems[0]) : container.appendChild(el);
  }
  return true;
}

export function observeResearchCard(cachedWorks, loadORCIDData, extractStaticWorks) {
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

function emptyWorks() {
  return { publications: [], conferences: [], services: [] };
}

function escapeHtml(text = "") {
  const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
  return text.replace(/[&<>"']/g, m => map[m]);
}
