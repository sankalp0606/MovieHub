import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <p className="mt-3 text-slate-300">Please log in to view your account.</p>
        <Link to="/login" className="mt-6 inline-block rounded-lg bg-violet-500 px-4 py-2 font-semibold text-white">Go to login</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-500/20 text-2xl font-bold text-violet-200">
              {(user.name || user.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-violet-300">Account</p>
              <h1 className="mt-2 text-3xl font-bold text-white">{user.name || 'User'}</h1>
            </div>
          </div>

          <button onClick={logout} className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">Logout</button>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Name</p>
            <p className="mt-3 text-xl font-semibold text-white">{user.name || 'Not provided'}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Email</p>
            <p className="mt-3 text-xl font-semibold text-white">{user.email}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Role</p>
            <p className="mt-3 text-xl font-semibold text-white">{user.role || 'USER'}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Profile image</p>
            <p className="mt-3 text-xl font-semibold text-white">{user.profileImage ? 'Available' : 'Not set'}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link to="/favorites" className="rounded-lg bg-violet-500 px-4 py-2 font-semibold text-white">Favorites</Link>
          <Link to="/reviews" className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 font-semibold text-white">Reviews</Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
