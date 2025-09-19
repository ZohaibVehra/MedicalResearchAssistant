const axios = require('axios')


//creates the encoded query string
const buildQuery = (raw, sort, freeOnly = false) => {
  let q = raw.trim()
  if (freeOnly) q += ' AND OPEN_ACCESS:Y'
  if (sort === 'latest') q += ' sort_date:y'
  else if (sort === 'mostCited') q += ' sort_cited:y'
  return encodeURIComponent(q)
}

//fetches a batch of 100 of a given query and sort
const fetchBatch = async ({ rawQuery, sort, freeOnly = false, max = 100 }) => {
  const encodedQuery = buildQuery(rawQuery, sort, freeOnly)
  const pageSize = Math.min(max, 100)
  const url = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodedQuery}&format=json&pageSize=${pageSize}&page=1`

  const { data } = await axios.get(url, { timeout: 8000 })
  const total = Number(data.hitCount || 0)
  const items = data.resultList?.result ?? []
  return { total, items }
}

//cleans up results format
const cleanItems = items =>
  items.map(a => {
    const publishedDate = a.firstPublicationDate || null
    const publishedYear =
      a.pubYear ||
      (publishedDate ? String(publishedDate).slice(0, 4) : null)

    return {
      title: a.title,
      authors: a.authorString,
      publishedYear,
      publishedDate,
      citations: a.citedByCount ?? 0,
      doi: a.doi || null,
      free: a.isOpenAccess === 'Y'
    }
  })


// fetches up to 100 results for each type of sort latest, relevance, mostCited
const getTripleResults = async ({ rawQuery, freeOnly = false, max = 100 }) => {
  if (!rawQuery || !rawQuery.trim()) throw new Error('rawQuery is required')

  const sorts = ['latest', 'relevance', 'mostCited']
  const [latestRes, relevanceRes, mostCitedRes] = await Promise.all(
    sorts.map(sort => fetchBatch({ rawQuery, sort, freeOnly, max }))
  )

  const latest = cleanItems(latestRes.items)
  const relevant = cleanItems(relevanceRes.items)
  const mostCited = cleanItems(mostCitedRes.items)

  // total will be 100 or less
  const reportedTotal = Math.min(
    max,
    latestRes.total || Infinity,
    relevanceRes.total || Infinity,
    mostCitedRes.total || Infinity
  )
  const totals = [latestRes.total, relevanceRes.total, mostCitedRes.total]
  .map(n => Number(n))
  .filter(n => Number.isFinite(n) && n >= 0)

  const total = totals.length ? Math.min(max, ...totals) : 0
  console.log(latest[0])
  console.log(latest)
  return { total, latest, relevant, mostCited }
}

//testing
if (require.main === module) {
  (async () => {
    const res = await getTripleResults({
      rawQuery: 'glioblastoma',
      freeOnly: true,
      max: 100
    })
    console.log('total:', res.total)
    console.log('latest[0]:', res.latest[0])
    console.log('relevant[0]:', res.relevant[0])
    console.log('mostCited[0]:', res.mostCited[0])
  })().catch(e => {
    console.error(e)
    process.exit(1)
  })
}

module.exports = { getTripleResults, buildQuery }
