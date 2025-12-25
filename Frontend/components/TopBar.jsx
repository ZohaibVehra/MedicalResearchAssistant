import logo from '../src/assets/logo.png'

const TopBar = ({ user, onLoginClick, onLogoutClick, onMobileSidebarToggle, registerToggle }) => {
  return (
    <header className="fixed top-0 inset-x-0 z-20 bg-black/65 backdrop-blur border-b border-white/10 text-white">
      {/* full-bleed row with responsive height and gutters */}
      <div className="h-14 md:h-16 xl:h-20 px-4 md:px-6 xl:px-10 flex items-center">
        {user && (
          <button
            onClick={onMobileSidebarToggle}
            className="lg:hidden rounded-xl px-3 py-2 bg-white/10 hover:bg-white/20"
          >
            Prior Searches
          </button>
        )}

        {/* left: logo pinned left */}
        <img
          src={logo}
          alt="Logo"
          className="h-9 md:h-10 xl:h-12 ml-2"
        />

        {/* spacer */}
        <div className="flex-1" />

        {/* right: auth pinned right */}
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <span className="hidden md:inline text-neutral-300 text-sm md:text-base">
                Login to save searches
              </span>
              <button
                onClick={onLoginClick}
                className="rounded-xl px-3 py-1.5 text-sm md:px-4 md:py-2 md:text-base bg-white/10 text-white hover:bg-white/20 border border-white/10">
                Log in
              </button>
              <button
                onClick={() => registerToggle(true)}
                 className="rounded-xl px-3 py-1.5 text-sm md:px-4 md:py-2 md:text-base
                    bg-gradient-to-r from-amber-700 to-yellow-700
                    text-amber-100 font-medium
                    border border-amber-800/60
                    shadow-[0_0_6px_rgba(255,191,0,0.25)]
                    hover:from-amber-600 hover:to-yellow-600
                    hover:shadow-[0_0_10px_rgba(255,191,0,0.4)]
                    transition"
              >
                Register
              </button>
            </>
          ) : (
            <>
              <span className="hidden sm:block text-neutral-300 text-sm md:text-base">
                {user.username}
              </span>
              <button
                onClick={onLogoutClick}
                className="rounded-xl px-4 py-2 text-sm md:text-base bg-white/10 hover:bg-white/20 border border-white/10"
              >
                Log out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default TopBar
