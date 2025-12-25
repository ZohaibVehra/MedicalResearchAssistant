import { useState } from 'react'
import logo from '../src/assets/logo.png'

const RegistrationForm = ({ registerUser, hideRegister }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [localError, setLocalError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const onSubmit = async e => {
    e.preventDefault()
    setLocalError('')
    setSuccessMsg('')

    if (!username.trim() || !password) {
      setLocalError('Please fill in all fields')
      return
    }
    if (password !== confirm) {
      setLocalError('Passwords do not match')
      return
    }

    try {
      setSubmitting(true)
      const ok = await registerUser({ username, password })

      if (ok.success) {
        setSuccessMsg('Registration successful, please log in')
        setUsername('')
        setPassword('')
        setConfirm('')
        setLocalError('')
        setTimeout(() => {
          hideRegister()
        }, 1500) 
      } else {
        if (ok.error) setLocalError(ok.error)
        else setLocalError('Registration failed')
      }
    } catch {
      setLocalError('Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='fixed inset-0 z-40'>
      {/* backdrop */}
      <div
        className='absolute inset-0 bg-black/40 backdrop-blur-sm'
        onClick={hideRegister}
        aria-hidden
      />

      {/* modal */}
      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby='register-title'
        className='absolute left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-neutral-900/90 text-white shadow-2xl'
      >
        <h2 id='register-title' className='pb-2 pt-7 text-xl font-semibold text-center'>
          Create account
        </h2>

        <img
          src={logo}
          alt='Logo'
          className='my-4 mx-auto h-13 md:h-15 xl:h-17'
        />

        {/* Status messages */}
        {successMsg && (
          <div
            className='mx-6 mb-2 rounded-lg border border-green-400 bg-green-500/15 px-3 py-2 text-sm text-green-200'
            role='status'
            aria-live='polite'
          >
            {successMsg}
          </div>
        )}
        {localError && !successMsg && (
          <p className='mx-6 mb-2 text-sm text-red-300' role='alert' aria-live='assertive'>
            {localError}
          </p>
        )}

        <form onSubmit={onSubmit} className='px-6 pb-6 pt-4 space-y-4'>
          <div>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              className='mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-neutral-300 focus:outline-none focus:ring-2 focus:ring-white/30'
              placeholder='Choose a username'
              autoFocus
              disabled={!!successMsg}
            />
          </div>

          <div className='relative'>
            <input
              type={showPwd ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className='mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-neutral-300 focus:outline-none focus:ring-2 focus:ring-white/30 pr-10'
              placeholder='Create a password'
              disabled={!!successMsg}
            />
            <button
              type='button'
              onClick={() => setShowPwd(v => !v)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-white'
              aria-label={showPwd ? 'Hide password' : 'Show password'}
              disabled={!!successMsg}
            >
              {showPwd ? (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' className='h-5 w-5' fill='currentColor'>
                  <path d='M3.53 2.47a.75.75 0 1 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-2.255-2.255C20.99 16.97 22.5 14.98 22.5 12c0-1.02-.26-2.002-.736-2.882-.67-1.222-1.69-2.287-2.87-3.101C17.71 4.2 15.93 3.5 14 3.5c-2.98 0-4.97 1.51-5.215 2.225L3.53 2.47ZM7.27 8.21 9 9.94A4 4 0 0 0 12 16a4 4 0 0 0 3.06-1.44l1.465 1.465A6.5 6.5 0 0 1 12 18.5C8.41 18.5 5.39 16.21 3.86 12c.486-1.35 1.25-2.5 2.21-3.45.39-.385.81-.73 1.2-1.04Zm6.53 2.53 2.02 2.02c.117-.243.18-.514.18-.8a2 2 0 0 0-2.2-2.2c-.286 0-.557.063-.8.18Z' />
                </svg>
              ) : (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' className='h-5 w-5' fill='currentColor'>
                  <path d='M12 5.5c-5.14 0-8.3 3.32-9.64 6.2a1.4 1.4 0 0 0 0 1.1C3.7 15.68 6.86 19 12 19s8.3-3.32 9.64-6.2a1.4 1.4 0 0 0 0-1.1C20.3 8.82 17.14 5.5 12 5.5Zm0 2c3.87 0 6.53 2.44 7.77 4.5-1.24 2.06-3.9 4.5-7.77 4.5S5.47 14.06 4.23 12c1.24-2.06 3.9-4.5 7.77-4.5Zm0 1.75A2.75 2.75 0 1 0 14.75 12 2.75 2.75 0 0 0 12 9.25Z' />
                </svg>
              )}
            </button>
          </div>

          <div className='relative'>
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className='mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2
                         text-white placeholder-neutral-300 focus:outline-none focus:ring-2 focus:ring-white/30 pr-10'
              placeholder='Confirm password'
              disabled={!!successMsg}
            />
            <button
              type='button'
              onClick={() => setShowConfirm(v => !v)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-white'
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
              disabled={!!successMsg}
            >
              {showConfirm ? (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' className='h-5 w-5' fill='currentColor'>
                  <path d='M3.53 2.47a.75.75 0 1 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-2.255-2.255C20.99 16.97 22.5 14.98 22.5 12c0-1.02-.26-2.002-.736-2.882-.67-1.222-1.69-2.287-2.87-3.101C17.71 4.2 15.93 3.5 14 3.5c-2.98 0-4.97 1.51-5.215 2.225L3.53 2.47ZM7.27 8.21 9 9.94A4 4 0 0 0 12 16a4 4 0 0 0 3.06-1.44l1.465 1.465A6.5 6.5 0 0 1 12 18.5C8.41 18.5 5.39 16.21 3.86 12c.486-1.35 1.25-2.5 2.21-3.45.39-.385.81-.73 1.2-1.04Zm6.53 2.53 2.02 2.02c.117-.243.18-.514.18-.8a2 2 0 0 0-2.2-2.2c-.286 0-.557.063-.8.18Z' />
                </svg>
              ) : (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' className='h-5 w-5' fill='currentColor'>
                  <path d='M12 5.5c-5.14 0-8.3 3.32-9.64 6.2a1.4 1.4 0 0 0 0 1.1C3.7 15.68 6.86 19 12 19s8.3-3.32 9.64-6.2a1.4 1.4 0 0 0 0-1.1C20.3 8.82 17.14 5.5 12 5.5Zm0 2c3.87 0 6.53 2.44 7.77 4.5-1.24 2.06-3.9 4.5-7.77 4.5S5.47 14.06 4.23 12c1.24-2.06 3.9-4.5 7.77-4.5Zm0 1.75A2.75 2.75 0 1 0 14.75 12 2.75 2.75 0 0 0 12 9.25Z' />
                </svg>
              )}
            </button>
          </div>

          <button
            type='submit'
            disabled={submitting || !!successMsg}
            className='mt-2 w-full rounded-xl px-4 py-2 font-medium bg-white text-neutral-900 hover:bg-neutral-200 disabled:opacity-60 disabled:cursor-not-allowed'
          >
            {successMsg ? 'Success!' : (submitting ? 'Creating account…' : 'Create account')}
          </button>

          <button
            type='button'
            onClick={hideRegister}
            disabled={!!successMsg}
            className='w-full mt-2 rounded-xl px-4 py-2 font-medium bg-white/10 text-white hover:bg-white/20 border border-white/10 disabled:opacity-60'
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegistrationForm
