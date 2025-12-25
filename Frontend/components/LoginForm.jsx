import { useState } from 'react'
import logo from '../src/assets/logo.png'

const LoginForm = ({ loginUser, hideLogin }) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [localError, setLocalError] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setLocalError('')
    const ok = await loginUser({ username, password })
    
    if(ok){
      setUsername('')
      setPassword('')
      hideLogin()
    }else{
      setLocalError('Invalid username or password')
    }
    setSubmitting(false)
  }

  return (
    <div className='fixed inset-0 z-40'>
      {/*this is backdrop to block everything else*/}
      <div
        className='absolute inset-0 bg-black/40 backdrop-blur-sm'
        onClick={hideLogin} //clicking this closes login
        aria-hidden
      />

      {/*centered login panel here*/}
      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby="login-title"
        className='absolute left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-neutral-900/90 text-white shadow-2xl'>
          
          {/*login text header*/}
          <h2 id='login-title' className='pb-2 pt-7 text-xl font-semibold text-center'>Sign in</h2>
          
          <img
            src={logo}
            alt="Logo"
            className="my-4 mx-auto h-13 md:h-15 xl:h-17"
          />
          

          {/* actual login form */}
          <form onSubmit={onSubmit} className='px-6 pb-6 pt-4 space-y-4'>
            <div>
              <label className="block text-sm text-neutral-300"></label>
              <input 
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className='mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2
                  text-white placeholder-neutral-300 focus:outline-none focus:ring-2 focus:ring-white/30'
                placeholder='Enter Username'
                autoFocus 
              />
            </div>

            <div>
              <label className='block text-sm text-neutral-300'></label>
              <input
                type='password'
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className='mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2
                  text-white placeholder-neutral-300 focus:outline-none focus:ring-2 focus:ring-white/30'
                placeholder='Enter Password'
              />
            </div>

            {/*if error show user here */}
            {localError && (
              <p className="text-sm text-red-300">{localError}</p>
            )}

            <button
              type='submit'
              disabled={submitting}
              className='mt-2 w-full rounded-xl px-4 py-2 font-medium bg-white text-neutral-900
                hover:bg-neutral-200 disabled:opacity-60 disabled:cursor-not-allowed'>
                  {submitting ? 'Signing in...' : 'Sign in'}
              </button>
              <button onClick={hideLogin}
              className='w-full mt-2 rounded-xl px-4 py-2 font-medium bg-white/10 text-white hover:bg-white/20 border border-white/10'>
                Cancel
            </button>
          </form>
          
      </div>  
    </div>
  )
}

export default LoginForm