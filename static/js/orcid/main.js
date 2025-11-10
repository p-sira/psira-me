import { buildResearchCard } from "./research-card.js";
import { Orcid } from "orcid-parser";
import { WORK_TYPES, WorkType } from "orcid-parser/constants";
export const WORK_CATEGORIES = ["publications", "conferences", "softwares", "services", "others"];
let client = new Orcid("0000-0002-5636-8870");
let works = null;
export function emptyWorks() {
    return {
        publications: [],
        conferences: [],
        softwares: [],
        services: [],
        others: [],
    };
}
function extractStaticWorks() {
    const staticWorks = emptyWorks();
    document.querySelectorAll("[data-static-works]").forEach(container => {
        const category = container.dataset.staticWorks;
        if (!category || !staticWorks[category])
            return;
        container.querySelectorAll("[data-work]").forEach(item => {
            const entry = item.dataset;
            const workType = entry.workType == "academic-service" ? "academic-service" : WORK_TYPES[entry.workType || "UNSUPPORTED"];
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
        case WORK_TYPES.SOFTWARE:
            return "softwares";
        case "academic-service":
            return "services";
        default:
            return "others";
    }
}
function workTypeToString(workType) {
    const str = workType.replace("-", " ");
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function parseORCIDWorks(works) {
    const parsedWorks = emptyWorks();
    works.forEach(work => {
        var _a;
        const category = mapOrcidTypeToCategory(work.type);
        const type = WorkType.fromString(work.type || "");
        parsedWorks[category].push({
            ...work,
            category,
            subtitle: (work.journalTitle || "") + ", " + (work.publicationYear || "") + " | " + WorkType.format(type),
            authors: ((_a = work.contributors) === null || _a === void 0 ? void 0 : _a.map((c) => c.name || "").join(", ")) || "",
            isStatic: false,
        });
    });
    return parsedWorks;
}
function mergeWorks(orcid, staticWorks) {
    const merged = emptyWorks();
    for (const key of Object.keys({ ...orcid, ...staticWorks })) {
        merged[key] = [...(orcid[key] || []), ...(staticWorks[key] || [])];
    }
    return merged;
}
export async function populateResearchCard(retry = 0) {
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
