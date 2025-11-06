import { populateResearchCard, observeResearchCard } from "./research-card.js";
import { ORCID, WORK_TYPES } from "orcid-parser";
let client = new ORCID("0000-0002-5636-8870");
let cachedWorks = null;
function sortWorks(a, b) {
    var _a, _b;
    if (a.displayIndex !== b.displayIndex)
        return a.displayIndex - b.displayIndex;
    const yearA = parseInt(((_a = a.subtitle.match(/\d{4}/)) === null || _a === void 0 ? void 0 : _a[0]) || "0");
    const yearB = parseInt(((_b = b.subtitle.match(/\d{4}/)) === null || _b === void 0 ? void 0 : _b[0]) || "0");
    return yearB - yearA;
}
function extractStaticWorks() {
    const staticWorks = {
        publications: [],
        conferences: [],
        services: []
    };
    document.querySelectorAll("[data-static-works]").forEach(container => {
        const category = container.dataset.staticWorks;
        if (!category || !staticWorks[category])
            return;
        container.querySelectorAll("[data-work]").forEach(item => {
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
    for (const cat in staticWorks)
        staticWorks[cat].sort(sortWorks);
    return staticWorks;
}
function mapOrcidTypeToCategory(type) {
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
function buildSubtitle(summary, year) {
    var _a;
    const journal = (_a = summary === null || summary === void 0 ? void 0 : summary["journal-title"]) === null || _a === void 0 ? void 0 : _a.value;
    if (journal && year)
        return `${journal}, ${year}`;
    return journal || year || "";
}
function parseSubtitle(subtitle) {
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
function buildWorkItem(summary) {
    var _a, _b, _c, _d, _e, _f, _g;
    const type = ((_a = summary === null || summary === void 0 ? void 0 : summary.type) === null || _a === void 0 ? void 0 : _a.value) || "other";
    const category = mapOrcidTypeToCategory(type);
    const year = ((_c = (_b = summary === null || summary === void 0 ? void 0 : summary["publication-date"]) === null || _b === void 0 ? void 0 : _b.year) === null || _c === void 0 ? void 0 : _c.value) || null;
    const title = ((_e = (_d = summary === null || summary === void 0 ? void 0 : summary.title) === null || _d === void 0 ? void 0 : _d.title) === null || _e === void 0 ? void 0 : _e.value) || "Untitled";
    const subtitle = buildSubtitle(summary, year);
    const url = extractURL(summary);
    return {
        title,
        subtitle,
        url,
        displayIndex: parseInt(((_f = summary === null || summary === void 0 ? void 0 : summary["display-index"]) === null || _f === void 0 ? void 0 : _f.value) || "999999"),
        type,
        category,
        journal: ((_g = summary === null || summary === void 0 ? void 0 : summary["journal-title"]) === null || _g === void 0 ? void 0 : _g.value) || undefined,
        year: year || undefined
    };
}
function extractURL(summary) {
    var _a, _b;
    const ids = (_a = summary === null || summary === void 0 ? void 0 : summary["external-ids"]) === null || _a === void 0 ? void 0 : _a["external-id"];
    if (!ids)
        return null;
    const list = Array.isArray(ids) ? ids : [ids];
    for (const id of list) {
        const url = (_b = id === null || id === void 0 ? void 0 : id["external-id-url"]) === null || _b === void 0 ? void 0 : _b.value;
        if (url && ["doi", "url"].includes(id === null || id === void 0 ? void 0 : id["external-id-type"]))
            return url;
    }
    return null;
}
function extractWorks(data) {
    const byCat = {
        publications: [],
        conferences: [],
        services: []
    };
    const groups = (data === null || data === void 0 ? void 0 : data.group) || [];
    for (const g of groups) {
        const summaries = (g === null || g === void 0 ? void 0 : g["work-summary"]) || [];
        for (const s of summaries) {
            const item = buildWorkItem(s);
            byCat[item.category || "services"].push(item);
        }
    }
    for (const cat in byCat)
        byCat[cat].sort(sortWorks);
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
        if (retry < 2)
            return setTimeout(() => loadORCIDData(retry + 1), 500);
        console.warn("ORCID fetch failed — showing static works only.");
        populateResearchCard(staticWorks);
        return;
    }
    cachedWorks = extractWorks(data);
    populateResearchCard(mergeWorks(cachedWorks, staticWorks));
}
export function mergeWorks(orcid, staticWorks) {
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
