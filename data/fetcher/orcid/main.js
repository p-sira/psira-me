const { Orcid } = require('orcid-parser');
const TOML = require('@iarna/toml');
const fs = require('fs').promises;
const path = require('path');

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

async function main() {
  const dataDir = path.join(__dirname, '..', '..');
  const staticFile = path.join(dataDir, 'static', 'research.toml');
  const outputFile = path.join(dataDir, 'research.toml');

  // Fetch ORCID works
  const client = new Orcid("0000-0002-5636-8870");
  const orcidWorks = await client.getWorks();

  if (!orcidWorks) {
    console.error("Failed to fetch ORCID works");
    process.exit(1);
  }

  // Organize works by category
  const organizedWorks = organizeWorksByCategory(orcidWorks);

  // Read static data
  let staticData = {
    publication: [],
    conference: [],
    software: [],
    service: []
  };

  try {
    const staticContent = await fs.readFile(staticFile, 'utf-8');
    const parsed = TOML.parse(staticContent);
    
    // TOML array-of-tables format [[publication]] creates arrays
    const categories = ['publication', 'conference', 'software', 'service'];
    for (const category of categories) {
      if (parsed[category]) {
        staticData[category] = Array.isArray(parsed[category]) ? parsed[category] : [parsed[category]];
      }
    }
  } catch (err) {
    console.warn(`Warning: Could not read static data file: ${err.message}`);
  }

  // Merge static and ORCID data (no distinction between them)
  const merged = {
    publication: [...organizedWorks.publication, ...staticData.publication],
    conference: [...organizedWorks.conference, ...staticData.conference],
    software: [...organizedWorks.software, ...staticData.software],
    service: [...organizedWorks.service, ...staticData.service]
  };

  // Save merged data as TOML, removing underscores from year values
  let tomlOutput = TOML.stringify(merged);
  // Remove underscores from year values (e.g., 2_025 -> 2025)
  tomlOutput = tomlOutput.replace(/year = (\d+)_(\d+)/g, 'year = $1$2');
  
  await fs.writeFile(outputFile, tomlOutput);
  console.log(`Successfully merged and saved research data to ${outputFile}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});