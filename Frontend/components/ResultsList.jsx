import { useState, useEffect } from 'react'

const ResultsList = ({ title = '', items = [], pageSize = 5, showEmpty = false }) => {
  const [page, setPage] = useState(0)

  useEffect(() => {
    setPage(0)
  }, [items])

  const total = Array.isArray(items) ? items.length : 0
  const maxPage = Math.max(Math.ceil(total / pageSize) - 1, 0)
  const start = page * pageSize
  const end = Math.min(start + pageSize, total)
  const visible = total ? items.slice(start, end) : []

  const canPrev = page > 0
  const canNext = page < maxPage

  const goPrev = () => {
    if (canPrev) setPage(p => p - 1)
  }

  const goNext = () => {
    if (canNext) setPage(p => p + 1)
  }

  if (!total && !showEmpty) return null

  if (!total && showEmpty) {
    return (
      <div className="w-[80%] md:w-[80%] mx-auto mt-6">
        {title && <h3 className="text-white/90 font-semibold mb-3 text-base md:text-lg">{title}</h3>}
        <div className="rounded-2xl bg-white/6 backdrop-blur border border-white/10 p-4">
          <p className="text-neutral-300 text-xs md:text-sm">No results</p>
        </div>
      </div>
    )
  }

  const toUrlFromDoi = doi => {
    if (!doi) return null
    return /^https?:\/\//i.test(doi) ? doi : `https://doi.org/${doi}`
  }

  const formatAuthors = author => {
    if (!author) return 'Unknown authors'
    if (Array.isArray(author)) return author.join(', ')
    return String(author)
  }

  const formatDate = (publishedDate, publishedYear) => {
    if (publishedDate) return publishedDate
    if (publishedYear) return String(publishedYear)
    return 'Date Unknown'
  }

  return (
    <div className="w-[80%] md:w-[80%] mx-auto mt-6">
      {/* header row */}
      {(title || total) && (
        <div className="mb-3 flex items-center justify-between">
          {title && <h3 className="text-white/90 font-semibold text-base md:text-lg">{title}</h3>}

          <div className="flex items-center gap-2">
            <span className="text-neutral-400 text-xs md:text-sm mr-1">
              {start + 1}–{end} of {total}
            </span>

            {/* prev */}
            <button
              type="button"
              onClick={goPrev}
              disabled={!canPrev}
              className="rounded-full h-8 w-8 flex items-center justify-center
                         bg-white/10 text-white border border-white/10
                         hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed"
              title={canPrev ? 'Previous' : 'At start'}
            >
              {/* chevron left */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L8.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {/* next */}
            <button
              type="button"
              onClick={goNext}
              disabled={!canNext}
              className="rounded-full h-8 w-8 flex items-center justify-center bg-white/10 text-white border border-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed"
              title={canNext ? 'Next' : 'No more results'}
            >
              {/* chevron right */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* list */}
      <div className="grid grid-cols-1 gap-3">
        {visible.map((it, i) => {
          const url = toUrlFromDoi(it.doi)
          const authors = formatAuthors(it.authors)
          const when = formatDate(it.publishedDate, it.publishedYear)
          const cites = typeof it.citations === 'number' ? it.citations : 0
          const isFree = Boolean(it.free)

          return (
            <div
              key={it.id ?? it.doi ?? `${start}-${i}`}
              className="rounded-2xl bg-white/6 backdrop-blur border border-white/10 p-4 hover:bg-white/8 transition"
            >
              {url ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white text-base md:text-lg font-semibold leading-snug hover:underline"
                  title="Open via DOI"
                >
                  {it.title || 'Untitled'}
                </a>
              ) : (
                <div className="text-white text-base md:text-lg font-semibold leading-snug">
                  {it.title || 'Untitled'}
                </div>
              )}

              <div className="mt-1 text-neutral-300 text-xs md:text-sm">
                {authors}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs md:text-sm">
                <span className="text-neutral-400">Published: {when}</span>
                <span className="text-neutral-400">Citations: {cites}</span>
                {isFree && (
                  <span className="rounded-md px-2 py-0.5 text-[10px] md:text-xs bg-emerald-400/15 text-emerald-200 border border-emerald-400/30">
                    free
                  </span>
                )}
              </div>

              <div className="mt-2 text-xs md:text-sm">
                {url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white underline underline-offset-2 hover:opacity-90"
                  >
                    Open via DOI
                  </a>
                ) : (
                  <span className="text-neutral-400">no url found</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ResultsList
