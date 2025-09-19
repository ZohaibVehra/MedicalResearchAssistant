const axios = require('axios');

const formatSearch = searchString => {
  return encodeURIComponent(searchString.trim());
};

const resultsFromPage = async (pageNum, encodedSearchString) => {
  const url = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodedSearchString}&format=json&pageSize=5&page=${pageNum}`;

  try {
    const { data } = await axios.get(url, { timeout: 8000 });
    const total = Number(data.hitCount || 0); // total hits for search
    const items = data.resultList?.result ?? []; // actual results

    return { total, items };
  } catch (err) {
    console.error('Error fetching from Europe PMC:', err.message);
    throw err;
  }
};

// Only run this block if executed directly, not when imported
if (require.main === module) {
  (async () => {
    const encoded = formatSearch("glioblastoma");
    const { total, items } = await resultsFromPage(1, encoded);

    console.log("Total results:", total);  // e.g. 1234
    console.log("This page count:", items[3]); // 5
  })();
}

module.exports = { formatSearch, resultsFromPage };
