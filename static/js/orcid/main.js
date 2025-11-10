import { populateResearchCard, observeResearchCard } from "./research-card.js";
import { Orcid } from "orcid-parser";
import { WORK_TYPES, WorkType } from "orcid-parser/constants";
let client = new Orcid("0000-0002-5636-8870");
let cachedWorks = null;
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
            const entry = item.dataset;
            const workType = WORK_TYPES[entry.workType || "UNSUPPORTED"];
            const category = mapOrcidTypeToCategory(workType);
            staticWorks[category].push({
                title: entry.workTitle || "",
                subtitle: entry.workSubtitle || "",
                url: entry.workUrl || null,
                type: workType,
                category,
                authors: entry.workAuthors || undefined,
                year: parseInt(entry.workYear || "9999"),
                index: parseInt(entry.workIndex || "9999"),
                isStatic: true,
            });
        });
    });
    return staticWorks;
}
function mapOrcidTypeToCategory(type) {
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
        default:
            return "services";
    }
}
function workTypeToString(workType) {
    const str = workType.replace("-", " ");
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function parseORCIDWorks(works) {
    const parsedWorks = {
        publications: [],
        conferences: [],
        services: []
    };
    works.forEach(work => {
        var _a;
        const category = mapOrcidTypeToCategory(work.type);
        const type = WorkType.fromString(work.type || "");
        parsedWorks[category].push({
            title: work.title,
            subtitle: (work.journalTitle || "") + ", " + (work.publicationYear || "") + " | " + WorkType.format(type),
            url: work.url || null,
            type,
            category,
            authors: ((_a = work.contributors) === null || _a === void 0 ? void 0 : _a.map((c) => c.name || "").join(", ")) || "",
            year: work.publicationYear || 9999,
            index: 0,
            isStatic: false,
        });
    });
    return parsedWorks;
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
    cachedWorks = parseORCIDWorks(data);
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
