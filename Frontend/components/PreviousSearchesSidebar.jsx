const PreviousSearchesSidebar = ({
  priorSearches = { count: 0, searches: [] },
  priorSearchClick,
  onDelete,
  setAiMode,
  setAiResponse 
}) => {
  const topSm = 'top-14'
  const topMd = 'md:top-16'
  const topXl = 'xl:top-20'

  const items = Array.isArray(priorSearches?.searches) ? priorSearches.searches : []

  return (
    <aside
      className={`fixed left-0 ${topSm} ${topMd} ${topXl} z-10 hidden lg:block w-72 h-[calc(100vh-5rem)] md:h-[calc(100vh-4rem)] xl:h-[calc(100vh-5rem)] px-3`}
    >
      <div className="rounded-2xl bg-white/6 backdrop-blur border border-white/10 h-full flex flex-col">
        {/* header */}
        <div className="p-3 border-b border-white/10">
          <h3 className="text-white font-semibold">Previous searches</h3>
          <p className="text-neutral-400 text-xs">{priorSearches.count ?? items.length} saved</p>
        </div>

        {/* list */}
        <div className="p-2 overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-neutral-400 text-sm">No searches yet</p>
          ) : (
            <ul className="space-y-2">
              {items.map((s, i) => {
                const label =
                  s.title || s.rawQuery || s.query || s.name || `Search #${i + 1}`
                return (
                  <li key={s.id ?? i}>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={async () => {
                           await priorSearchClick(s)
                           setAiMode('closed')
                           setAiResponse([]) 
                        }}
                        className="w-full text-left rounded-xl border border-white/10 bg-white/5
                                  hover:bg-white/10 transition px-3 py-2 pr-8" // add right padding so text doesn't overlap the x
                        title={label}
                      >
                        <span className="block text-white text-sm line-clamp-2">{label}</span>
                        {s.createdAt && (
                          <span className="block text-neutral-400 text-xs mt-0.5">
                            {new Date(s.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </button>

                      {/* delete button absolutely positioned */}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation() // prevent triggering the parent button
                            onDelete(s)
                          }}
                          className="absolute top-1/2 right-2 -translate-y-1/2 h-5 w-5 rounded-full flex items-center justify-center bg-black/50 text-neutral-300 hover:text-red-400 hover:bg-black/70 text-sm"
                          title="Delete search"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </aside>
  )
}

export default PreviousSearchesSidebar
