const { Orcid } = require('orcid-parser');

function mapOrcidTypeToCategory(type) {
  if (!type) return "others";
  switch (type.toLowerCase()) {
    case "journal-article":
    case "article":
    case "conference-paper":
    case "conference-proceedings":
    case "book":
    case "book-chapter":
    case "preprint":
      return "publication";
    case "conference-presentation":
    case "conference-poster":
    case "conference-output":
      return "conference";
    case "software":
      return "software";
    case "academic-service":
      return "service";
    default:
      return "others";
  }
}

function formatWork(work) {
  const type = work.type || "";
  const category = mapOrcidTypeToCategory(type);
  
  let subtitle = "";
  if (work.journalTitle) {
    subtitle = work.publicationYear ? `${work.journalTitle}, ${work.publicationYear}` : work.journalTitle;
  } else if (work.publicationYear) {
    subtitle = `${work.publicationYear}`;
  }

  const item = {
    title: work.title || "",
    ...(subtitle && { subtitle: subtitle.trim() }),
    ...(work.publicationYear && { year: work.publicationYear }),
    ...(type && { type }),
    ...(work.contributors?.length && { authors: work.contributors.map(c => c.name || "").join(", ") }),
    ...(work.url && { url: work.url })
  };

  return { item, category };
}

function organizeWorksByCategory(works) {
  const organized = {
    publication: [],
    conference: [],
    software: [],
    service: [],
    others: []
  };

  // Sort works by date, most recent first
  works.sort((a, b) => {
    const yearA = a.publicationYear || 0;
    const yearB = b.publicationYear || 0;
    if (yearA !== yearB) return yearB - yearA;
    
    const monthA = a.publicationMonth || 0;
    const monthB = b.publicationMonth || 0;
    if (monthA !== monthB) return monthB - monthA;
    
    const dayA = a.publicationDay || 0;
    const dayB = b.publicationDay || 0;
    return dayB - dayA;
  });

  // Format and organize into categories
  for (const work of works) {
    const { item, category } = formatWork(work);
    if (category !== "others") {
      organized[category].push(item);
    }
  }

  return organized;
}

async function fetchOrcidWorks(orcidId) {
  const client = new Orcid(orcidId);
  const orcidWorks = await client.getWorks();

  if (!orcidWorks) {
    throw new Error("Failed to fetch ORCID works");
  }

  return organizeWorksByCategory(orcidWorks);
}

module.exports = {
  fetchOrcidWorks
};

