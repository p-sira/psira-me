function sortWorks(a, b) {
    var _a, _b;
    if (a.displayIndex !== b.displayIndex)
        return a.displayIndex - b.displayIndex;
    const yearA = parseInt(((_a = a.subtitle.match(/\d{4}/)) === null || _a === void 0 ? void 0 : _a[0]) || "0");
    const yearB = parseInt(((_b = b.subtitle.match(/\d{4}/)) === null || _b === void 0 ? void 0 : _b[0]) || "0");
    return yearB - yearA;
}
export function createWorkElement(work, categoryHint) {
    const div = document.createElement("div");
    const color = work.borderColor || "primary";
    div.className = `border-l-4 border-${color} pl-4`;
    const meta = work.journal || work.year
        ? escapeHtml([work.journal, work.year].filter(Boolean).join(", "))
        : (work.subtitle ? escapeHtml(work.subtitle) : "");
    const authors = work.authors ? `<p class="text-secondary">${escapeHtml(work.authors)}</p>` : "";
    const cat = (categoryHint || work.category || "").toString();
    const showCopy = cat === "publications" || cat === "conferences";
    const copyBtnId = showCopy ? `copy-${Math.random().toString(36).slice(2)}` : "";
    div.innerHTML = `
    <h4 class="text-lg font-semibold text-primary mb-2">
      ${work.url
        ? `<a href="${escapeHtml(work.url)}" target="_blank" rel="noopener noreferrer" class="hover:underline">${escapeHtml(work.title)}</a>`
        : escapeHtml(work.title)}
    </h4>
    ${meta ? `<p class="text-secondary mb-2">${meta}</p>` : ""}
    ${authors}
    ${showCopy ? `<div class="mt-2"><button id="${copyBtnId}" class="btn-copy">Copy citation</button></div>` : ""}
    ${work.type ? `<p class="text-tertiary">${escapeHtml(work.type)}</p>` : ""}
  `;
    if (showCopy) {
        const btn = div.querySelector(`#${copyBtnId}`);
        if (!btn)
            return div;
        btn.addEventListener("click", async () => {
            const citation = buildCitation(work);
            try {
                await navigator.clipboard.writeText(citation);
                btn.textContent = "Copied!";
                setTimeout(() => { btn.textContent = "Copy citation"; }, 1200);
            }
            catch {
                btn.textContent = "Copy failed";
                setTimeout(() => { btn.textContent = "Copy citation"; }, 1200);
            }
        });
    }
    return div;
}
export function populateResearchCard(allWorks) {
    const categories = ["publications", "conferences", "services"];
    return categories.some(cat => populateTab(cat, allWorks[cat] || []));
}
function populateTab(category, works) {
    const tab = document.getElementById(`${category}-tab`);
    if (!tab)
        return false;
    const container = tab.querySelector(".space-y-6");
    if (!container)
        return false;
    container.querySelectorAll(".border-l-4:not([data-work])").forEach(el => el.remove());
    container.querySelectorAll("p.text-secondary").forEach(p => {
        if (p.textContent && p.textContent.trim() === "No items found.")
            p.remove();
    });
    const staticItems = Array.from(container.querySelectorAll("[data-work]"));
    if (works.length === 0 && staticItems.length === 0) {
        container.innerHTML = `<p class="text-secondary">No items found.</p>`;
        return true;
    }
    for (const w of works) {
        const el = createWorkElement(w, category);
        staticItems.length ? container.insertBefore(el, staticItems[0]) : container.appendChild(el);
    }
    return true;
}
export function observeResearchCard(cachedWorks, loadORCIDData, extractStaticWorks) {
    const card = document.getElementById("research-card");
    if (!card)
        return;
    new MutationObserver(mutations => {
        for (const m of mutations) {
            if (m.type === "attributes" && m.attributeName === "aria-hidden") {
                const visible = card.getAttribute("aria-hidden") === "false";
                if (!visible)
                    continue;
                const staticWorks = extractStaticWorks();
                const merged = mergeWorks(cachedWorks || emptyWorks(), staticWorks);
                populateResearchCard(merged);
                if (!cachedWorks)
                    loadORCIDData();
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
function mergeWorks(a, b) {
    return {
        publications: [...(a.publications || []), ...(b.publications || [])],
        conferences: [...(a.conferences || []), ...(b.conferences || [])],
        services: [...(a.services || []), ...(b.services || [])]
    };
}
function buildCitation(work) {
    const parts = [];
    if (work.authors)
        parts.push(work.authors.trim().replace(/\.?$/, "."));
    parts.push(work.title.trim().replace(/\.?$/, "."));
    const venue = [work.journal, work.year].filter(Boolean).join(", ");
    if (venue)
        parts.push(venue.trim().replace(/\.?$/, "."));
    if (work.url)
        parts.push(work.url);
    return parts.join(" ");
}
