const TOML = require('@iarna/toml');
const fs = require('fs').promises;
const path = require('path');
const { fetchOrcidWorks } = require('./orcid');

async function updateResearchData() {
  const dataDir = path.join(__dirname, '..');
  const staticFile = path.join(dataDir, 'static', 'research.toml');
  const outputFile = path.join(dataDir, 'research.toml');

  // Fetch ORCID works
  const organizedWorks = await fetchOrcidWorks("0000-0002-5636-8870");

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

async function main() {
  console.log('Updating research data...');
  await updateResearchData();
  
  console.log('All data updated successfully!');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});