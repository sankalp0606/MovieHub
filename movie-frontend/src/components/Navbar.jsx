import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const links = [
    ['Home', '/'],
    ['Movies', '/movies'],
    ['TV Shows', '/tv-shows'],
    ['Trending', '/trending'],
    ['Indian Movies', '/indian-movies'],
    ['Search', '/search'],
    ['Favorites', '/favorites'],
    ['Reviews', '/reviews'],
    ['Profile', '/profile'],
    ...(user?.role === 'ADMIN' ? [['Admin Dashboard', '/admin']] : []),
  ];

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-xl text-white hover:bg-white/10 transition"
            >
              ☰
            </button>
            <Link to="/" className="text-xl font-black tracking-tight text-white flex items-center gap-1">
              Movie<span className="text-violet-400">Hub</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/search"
              aria-label="Search"
              className="text-slate-300 hover:text-white p-2 text-lg transition"
            >
              🔍
            </Link>
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 rounded-xl bg-violet-500/10 border border-violet-400/20 px-3 py-1.5 text-sm font-semibold text-violet-200 hover:bg-violet-500/20 transition"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-xs font-bold text-white">
                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden sm:inline">{user.name || user.email}</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-300 hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-violet-600 hover:bg-violet-500 px-3.5 py-1.5 text-sm font-semibold text-white transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {menuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setMenuOpen(false)}
        >
          <aside
            onClick={(event) => event.stopPropagation()}
            className="h-full w-[min(86vw,340px)] border-r border-white/10 bg-[#0e0d1b] p-6 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="mb-8 flex items-center justify-between">
                <span className="text-xl font-black text-white flex items-center gap-1">
                  Movie<span className="text-violet-400">Hub</span>
                </span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="text-2xl text-slate-400 hover:text-white transition"
                >
                  ✕
                </button>
              </div>

              <nav className="flex flex-col gap-1.5">
                {links.map(([label, path]) => (
                  <NavLink
                    key={label}
                    to={path}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `rounded-xl px-4 py-2.5 text-base font-semibold transition ${
                        isActive
                          ? 'bg-violet-600 text-white shadow-md shadow-violet-950/40'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="border-t border-white/10 pt-4">
              {user ? (
                <div className="space-y-3">
                  <div className="px-2 text-xs text-slate-400">
                    Signed in as <span className="font-semibold text-white">{user.email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-left text-sm text-slate-300 hover:text-white hover:bg-white/10 transition"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl bg-violet-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-violet-500"
                >
                  Create account
                </Link>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default Navbar;
