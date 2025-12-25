const MobileSidebar = ({ setAiMode, setAiResponse, priorSearches, onDelete, onClose, priorSearchClick }) => {
  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* sidebar panel */}
      <div className="absolute top-0 left-0 h-full w-72 bg-neutral-900 text-white shadow-xl p-4">
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Previous Searches</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white text-xl"
          >
            ×
          </button>
        </div>
        <div className="mt-5">
        {priorSearches?.searches?.length > 0 ? (
          <ul className="space-y-2">
            {priorSearches.searches.map((s) => (
              <li key={s.id} className="relative">
                <button
                  onClick={async () => {
                    await priorSearchClick(s)
                    setAiMode('closed')
                    setAiResponse([]) 
                    onClose()
                  }}
                  type="button"
                  className="w-full rounded-lg bg-white/5 px-3 py-2 text-left hover:bg-white/10"
                >
                  {s.rawQuery}
                </button>
                <button
                  onClick={() => onDelete(s)}
                  className="absolute top-1/2 right-2 -translate-y-1/2 text-neutral-400 hover:text-red-400"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-neutral-400">No saved searches</p>
        )}
        </div>
      </div>
    </div>
  )
}

export default MobileSidebar
