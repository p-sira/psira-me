import { WORK_CATEGORIES } from "./main.js";
export function createWorkElement(work) {
    const div = document.createElement("div");
    div.className = `border-l-4 border-primary pl-4`;
    const yearStr = typeof work.publicationYear === "number" ? work.publicationYear.toString() : "";
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
export function buildResearchCard(works) {
    return WORK_CATEGORIES.map(cat => populateTab(cat, works[cat]));
}
function populateTab(category, works) {
    const tab = document.getElementById(`${category}-tab`);
    console.log(`Populating: ${category}`);
    console.log(works);
    console.log("");
    if (!tab)
        return false;
    const container = tab.querySelector(".space-y-6");
    if (!container)
        return false;
    // Store static items and clear dynamic content
    const staticItems = Array.from(container.querySelectorAll("[data-work]"));
    const fragment = document.createDocumentFragment();
    staticItems.forEach(item => fragment.appendChild(item));
    // Clear the container
    container.innerHTML = "";
    // If no content at all, show "No items found"
    if (works.length === 0 && staticItems.length === 0) {
        container.innerHTML = `<p class="text-secondary">No items found.</p>`;
        return true;
    }
    // Add new works first
    works.forEach(work => {
        const elem = createWorkElement(work);
        container.appendChild(elem);
    });
    // Append static items after dynamic content
    if (staticItems.length > 0) {
        container.appendChild(fragment);
    }
    return true;
}
function escapeHtml(text = "") {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return text.replace(/[&<>"']/g, m => map[m]);
}
function buildCitation(work) {
    const parts = [];
    if (work.authors)
        parts.push(work.authors.trim().replace(/\.?$/, "."));
    parts.push(work.title.trim().replace(/\.?$/, "."));
    const yearStr = typeof work.publicationYear === "number" ? work.publicationYear.toString() : "";
    const venue = [work.subtitle, yearStr].filter(Boolean).join(", ");
    if (venue)
        parts.push(venue.trim().replace(/\.?$/, "."));
    if (work.url)
        parts.push(work.url);
    return parts.join(" ");
}
