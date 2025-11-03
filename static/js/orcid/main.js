import { fetchORCIDData, extractWorks, extractStaticWorks, mergeWorks } from "./orcidParser.js";
import { populateResearchCard, observeResearchCard } from "./researchCard.js";

let cachedWorks = null;

async function loadORCIDData(retry = 0) {
  const staticWorks = extractStaticWorks();

  if (cachedWorks) {
    populateResearchCard(mergeWorks(cachedWorks, staticWorks));
    return;
  }

  const data = await fetchORCIDData();
  if (!data) {
    if (retry < 2) return setTimeout(() => loadORCIDData(retry + 1), 500);
    console.warn("ORCID fetch failed — showing static works only.");
    populateResearchCard(staticWorks);
    return;
  }

  cachedWorks = extractWorks(data);
  populateResearchCard(mergeWorks(cachedWorks, staticWorks));
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
