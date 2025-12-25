const ResultsTabs = ({ resultView, setResultView }) => {
  const tabs = [
    { key: 'relevant', label: 'Most relevant' },
    { key: 'latest', label: 'Latest' },
    { key: 'mostCited', label: 'Most cited' },
  ]

  return (
    <div className="w-[80%] md:w-[80%] mx-auto mt-6">
      <div className="inline-flex rounded-xl border border-white/10 bg-white/6 backdrop-blur p-1">
        {tabs.map(tab => {
          const active = resultView === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setResultView(tab.key)}
              type="button"
              className={`px-3 py-1.5 md:px-5 md:py-2.5 lg:px-6 lg:py-3 text-sm md:text-base lg:text-lg rounded-lg transition
                ${active
                  ? 'bg-white text-neutral-900 font-semibold'
                  : 'text-neutral-300 hover:text-white hover:bg-white/10'
                }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ResultsTabs
