import { useState } from 'react'

const AIToggle = ({ aiMode, setAiMode, aiError, buttonLabel = 'AI assistant', handleRefinement, handleGenerate }) => {
  const [refineText, setRefineText] = useState('')
  const [generateText, setGenerateText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onRefine = async e => {
    e.preventDefault()
    const q = refineText.trim()
    if (!q) return
    setSubmitting(true)
    await handleRefinement({ query: q })
    setSubmitting(false)
    setRefineText('')
  }

  const onGenerate = async e => {
    e.preventDefault()
    const t = generateText.trim()
    if (!t) return
    setSubmitting(true)
    await handleGenerate({ topic: t })
    setSubmitting(false)
    setGenerateText('')
  }

  if (aiMode === 'closed') {
    return (
      <div className="w-[80%] md:w-[80%] mx-auto">
        <button
          onClick={() => setAiMode('refine')}
          className="rounded-xl px-4 py-2 font-medium bg-white/10 text-white hover:bg-white/20 border border-white/10"
        >
          {buttonLabel}
        </button>
      </div>
    )
  }

  return (
    <div className="w-[80%] md:w-[80%] mx-auto">
      <div className="mt-3 rounded-2xl bg-white/6 backdrop-blur border border-white/10 p-4">
        
        {/* Error message */}
        {aiError && (
          <p className="pl-3 text-red-400 text-sm md:text-base font-medium mb-1">
            {aiError}
          </p>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAiMode('refine')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium border ${
              aiMode === 'refine'
                ? 'bg-white text-neutral-900 border-white/20'
                : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
            }`}
          >
            Search refinement
          </button>
          <button
            onClick={() => setAiMode('generate')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium border ${
              aiMode === 'generate'
                ? 'bg-white text-neutral-900 border-white/20'
                : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
            }`}
          >
            Generate search text
          </button>

          <div className="flex-1" />
          <button
            onClick={() => setAiMode('closed')}
            className="rounded-lg px-3 py-1.5 text-sm font-medium bg-white/5 text-white border border-white/10 hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {aiMode === 'refine' && (
          <form onSubmit={onRefine} className="mt-4 space-y-2">
            <label className="block text-sm text-neutral-300">Enter your current query</label>
            <input
              value={refineText}
              onChange={e => setRefineText(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 
                        px-2 py-1.5 text-sm md:px-3 md:py-2 md:text-base 
                        text-white placeholder:text-xs md:placeholder:text-sm 
                        placeholder-neutral-300 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="e.g glioblastoma chemo resistance"
            />
            <div className="pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl px-3 py-1.5 text-sm md:px-4 md:py-2 md:text-base 
                  font-medium bg-white text-neutral-900 
                  hover:bg-neutral-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                {submitting ? 'Refining…' : 'Refine search'}
              </button>
            </div>
          </form>
        )}

        {aiMode === 'generate' && (
          <form onSubmit={onGenerate} className="mt-4 space-y-2">
            <label className="block text-sm text-neutral-300">Describe what you need</label>
            <input
              value={generateText}
              onChange={e => setGenerateText(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 
                        px-2 py-1.5 text-sm md:px-3 md:py-2 md:text-base 
                        text-white placeholder:text-xs md:placeholder:text-sm 
                        placeholder-neutral-300 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="e.g biomarkers for early Alzheimer’s"
            />
            <div className="pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl px-3 py-1.5 text-sm md:px-4 md:py-2 md:text-base 
                  font-medium bg-white text-neutral-900 
                  hover:bg-neutral-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Generating…' : 'Generate searches'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default AIToggle
