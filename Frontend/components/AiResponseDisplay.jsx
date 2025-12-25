import { useState } from 'react'

const AiResponseDisplay = ({ aiResponse, onClose }) => { 
  const [copiedIndex, setCopiedIndex] = useState(-1)

  if (!Array.isArray(aiResponse) || aiResponse.length === 0) return null

  const copyToClipboard = async (text, i) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        const ta = document.createElement('textarea')
        ta.value = text
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopiedIndex(i)
      setTimeout(() => setCopiedIndex(-1), 1200)
    } catch (error) {
      console.log('error when copying ai results', error)
      setCopiedIndex(i)
      setTimeout(() => setCopiedIndex(-1), 1200)
    }
  }

  return (
    <div className="w-[80%] md:w-[80%] mx-auto mt-4">
      <div className="relative rounded-2xl bg-white/6 backdrop-blur border border-white/10 p-4">
       
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-white font-semibold">AI suggestions</h3>
          <div className="flex items-center gap-3">
            <p className="text-neutral-300 text-xs">click to copy</p>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-md px-2 py-1 text-xs bg-white/10 hover:bg-white/20 border border-white/10 text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <ul className="grid gap-2 sm:grid-cols-2">
          {aiResponse.map((text, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => copyToClipboard(text, i)}
                className="group w-full text-left rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition px-3 py-3"
              >
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/20 text-xs text-neutral-300">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-white text-sm md:text-base leading-snug">
                      {text}
                    </p>
                    <span
                      className={`block text-xs mt-1 ${
                        copiedIndex === i ? 'text-emerald-300' : 'text-neutral-400 opacity-0 group-hover:opacity-100'
                      } transition`}
                      aria-live="polite"
                    >
                      {copiedIndex === i ? 'Copied!' : 'Copy'}
                    </span>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AiResponseDisplay
