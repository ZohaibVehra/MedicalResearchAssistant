import { useState } from "react"

const SearchBar = ({ rawQuery, setRawQuery, searching, onSearch, searchError }) => {

  const [freeOnly, setFreeOnly] = useState(false)

  const handleSubmit = event => {
    event.preventDefault()
    if(!searching){
      onSearch({ rawQuery, freeOnly })
      setRawQuery('')
    } 
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='w-[80%] md:w-[80%] mx-auto flex flex-col gap-2'
    >
      {/* Error message */}
      {searchError && (
        <p className="pl-3 text-red-400 text-sm md:text-base font-medium mb-1">
          {searchError}
        </p>
      )}

      {/* Search input + button */}
      <div className='w-full flex flex-row items-center gap-3'>
        <input
          type="text"
          value={rawQuery}
          disabled={searching} //disabled while search in progess
          onChange={event => setRawQuery(event.target.value)}
          placeholder="Search medical articles..."
          className="w-full md:flex-1 rounded-xl bg-white/5 border border-white/10 
            px-4 py-2 text-white placeholder-neutral-300 focus:outline-none focus:ring-2 focus:ring-white/30
            text-sm md:text-base lg:text-lg xl:text-xl
            lg:px-5 lg:py-3"
        />

        <button
          type="submit"
          disabled={searching}
          className="rounded-xl font-medium bg-white text-neutral-900 hover:bg-neutral-200
            px-4 py-2 text-sm md:text-base lg:text-lg xl:text-xl
            lg:px-5 lg:py-3"
        >
          {searching ? 'Searching…' : 'Search'}
        </button>
      </div>

      {/* Checkbox aligned left below search */}
      <label className="flex items-center gap-2 text-sm md:text-base lg:text-lg text-white mt-1">
        <input
          type="checkbox"
          disabled={searching}
          checked={freeOnly}
          onChange={event => setFreeOnly(event.target.checked)}
          className="ml-4 form-checkbox h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-white bg-white/10 border-white/20 rounded"
        />
        Free only
      </label>
    </form>
  )
}

export default SearchBar
