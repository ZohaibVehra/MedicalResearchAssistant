import { useState, useEffect } from "react"
import SearchBar from "../components/searchBar"
import searchesService from '../services/searches'
import Notification from "../components/Notification"
import loginService from '../services/login'
import ResultsList from '../components/ResultsList'
import AIToggle from '../components/AIToggle'
import aiService from '../services/ai'
import PageBackground from "../components/PageBackground"
import TopBar from "../components/TopBar"
import LoginForm from '../components/LoginForm'
import AiResponseDisplay from '../components/AiResponseDisplay'
import PreviousSearchesSidebar from "../components/PreviousSearchesSidebar"
import MobileSidebar from "../components/MobileSidebar"
import ResultsTabs from '../components/ResultsTabs'
import RegistrationForm from "../components/RegistrationForm"

function App() {
  const [errorMessage, setErrorMessage] = useState(null)
  const [results, setResults] = useState(null)
  const [user, setUser] = useState(null)
  const [priorSearches, setPriorSearches] = useState({ count: 0, searches: [] })
  const [showLogin, setShowLogin] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [searching, setSearching] = useState(false)
  const [aiResponse, setAiResponse] = useState([])
  const [aiError, setAiError] = useState('')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [rawQuery, setRawQuery] = useState('')
  const [resultView, setResultView] = useState('relevant') // 'relevant' | 'latest' | 'mostCited'
  const [aiMode, setAiMode] = useState('closed') // 'closed' | 'refine' | 'generate'
  const [showRegister, setShowRegister] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedMSAUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      searchesService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    if (!user?.token) return
    (async () => {
      try {
        const data = await searchesService.findMine() 
        setPriorSearches(data)
        
      } catch (e) {
        setErrorMessage(`Could not load your prior searches, ${e}`)
        setTimeout(() => setErrorMessage(null), 3000)
      }
    })()
  }, [user])

   const currentItems =
    results
      ? resultView === 'latest'
        ? results.latest
        : resultView === 'mostCited'
          ? (results.mostCited ?? results.mostcited)
          : results.relevant
      : []

  const handleSearch = async queryObject => {
    try{
      if(queryObject.rawQuery === ''){
         setSearchError(
          'Please enter text into the search bar'
          )
          setTimeout(() => {
            setSearchError(null)
          }, 3000)
          return
      }
      setSearching(true)
      const searchResult = await searchesService.create(queryObject)
      
      setHasSearched(true)
      if(searchResult.total === 0){
        setSearchError('No search results found, try a different search')
        setTimeout(() => setSearchError(''), 5000)
      }else{
        setResults(searchResult)
        setAiMode('closed')
        setAiResponse([]) 
        if(user){
          const data = await searchesService.findMine()
        setPriorSearches(data)
        }
      }  
    }catch{
      setErrorMessage(
          'Error performing search, please try again later'
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)
    }finally{
      setSearching(false)
    }
  }

  const logout = () => {
    setUser(null)
    searchesService.setToken('')
    setPriorSearches({ count: 0, searches: [] })
    window.localStorage.removeItem('loggedMSAUser')
    setResults(null)
    setAiMode('closed')
    setAiResponse([])
    setHasSearched(false)
  }

  const handleRegister = async (registerObject) => {
    try{
      await loginService.register(registerObject)
      return {success: true}
    }catch(error){
      if(error.response.data.error === "expected `username` to be unique"){
        return {success:false, error:'username taken'}
      }
      return false
    }
  }

  const handleLogin = async (loginObject) => {
    try{
      const user = await loginService.login(loginObject)
      

      window.localStorage.setItem(
        'loggedMSAUser', JSON.stringify(user)
      )
      searchesService.setToken(user.token)
      setUser(user)
      return true
    } catch{
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
      return false
    }
  }


  const deletePriorSearch = async search => {
    try{
      await searchesService.deleteSearch(search.id)
      const newPriors = {...priorSearches}
      newPriors.searches = newPriors.searches.filter(s => s.id !== search.id )
      setPriorSearches(newPriors)  
    }catch{
      setErrorMessage('Failed to delete, try again later')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }
  
  const handleRefinement = async ({ query }) => {
    try{
      const suggestions = await aiService.rephrase(query)

      if(Array.isArray(suggestions) && suggestions.length === 5 
        && suggestions.every(s => typeof s === 'string')){
          setAiResponse(suggestions)
      }else{
        console.warn('Unexpected AI response format:', suggestions)
        setAiResponse([])
      }
    }catch(error){
      console.log('Error in AI refinement', error)
      setAiError(
          'AI error when refining search, try again later'
          )
          setTimeout(() => {
            setAiError(null)
          }, 3000)
      setAiResponse([])      
    }
  }

  const handleGenerate = async ({ topic }) => {
     try{
      const suggestions = await aiService.generateFromTopic(topic)

      if(Array.isArray(suggestions) && suggestions.length === 5 
        && suggestions.every(s => typeof s === 'string')){
          setAiResponse(suggestions)
      }else{
        console.warn('Unexpected AI response format:', suggestions)
        setAiResponse([])
      }
    }catch(error){
      console.log('Error in AI refinement', error)
      setAiError(
          'AI error when generating searches, try again later'
          )
          setTimeout(() => {
            setAiError(null)
          }, 3000)
      setAiResponse([])      
    }
  }

  const priorSearchClick = async search => {
    try{
      const getOldResult = await searchesService.getById(search.id)
      if(getOldResult){
        setResults(getOldResult)
        setRawQuery(search.rawQuery)
        setHasSearched(true)
      }
      
    }catch(error){
      console.log('error setting previous result',error)   
    }
  }

  return (
    <>
      <PageBackground />
      <TopBar user={user}  registerToggle={setShowRegister} onLoginClick={() => setShowLogin(true)} onLogoutClick={logout} onMobileSidebarToggle={() => setMobileSidebarOpen(true)}/>
      {user && (
        <PreviousSearchesSidebar
          priorSearchClick={priorSearchClick}
          onDelete={deletePriorSearch}
          priorSearches={priorSearches}
          setAiMode={setAiMode}
          setAiResponse={setAiResponse}
        />
      )}

      {mobileSidebarOpen && (
        <MobileSidebar
          priorSearchClick={priorSearchClick}
          priorSearches={priorSearches}
          onDelete={deletePriorSearch}
          onClose={() => setMobileSidebarOpen(false)}
          setAiMode={setAiMode}
          setAiResponse={setAiResponse}
        />
    )}
      <div className={`pt-20 md:pt-24 xl:pt-26 ${user ? 'lg:pl-80' : ''} min-h-dvh overflow-x-hidden`}>
        {showRegister && <RegistrationForm hideRegister={() => setShowRegister(false)} registerUser={handleRegister}/>}
        {showLogin && <LoginForm hideLogin={() => setShowLogin(false)} loginUser={handleLogin} />}
        
        <Notification message={errorMessage} />

        <SearchBar rawQuery={rawQuery} setRawQuery={setRawQuery} searching={searching} searchError={searchError} onSearch={handleSearch} />
        
        {/*AI assistant*/}
        <div className="mt-8">
          <AIToggle
            aiMode={aiMode}
            setAiMode={setAiMode}
            aiError={aiError}
            buttonLabel="AI assistant"
            handleRefinement={handleRefinement}
            handleGenerate={handleGenerate}
          />
        </div>

        {/*Ai results*/}
        <AiResponseDisplay
          aiResponse={aiResponse}
          onClose={() => setAiResponse([])}
        />
        <br></br>
        {results && (
          <ResultsTabs resultView={resultView} setResultView={setResultView} />
        )}
        <ResultsList items={currentItems} showEmpty={hasSearched} />
      </div>
    </>
  )
}

export default App
