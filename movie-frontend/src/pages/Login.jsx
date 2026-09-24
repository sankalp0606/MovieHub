import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    setSubmitting(true);

    try {
      const result = await login({ email, password });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      const nextPath = location.state?.from?.pathname || '/';
      navigate(nextPath, { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white">Welcome back</h1>
        <p className="mt-2 text-slate-300">Sign in to continue to your movie hub.</p>

        {error && <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-sm text-slate-200">Email</label>
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none ring-0 placeholder:text-slate-500" placeholder="you@example.com" required />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-200">Password</label>
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none ring-0 placeholder:text-slate-500" placeholder="••••••••" required />
          </div>

          <button type="submit" disabled={submitting} className="w-full rounded-lg bg-violet-500 px-4 py-3 font-semibold text-white hover:bg-violet-400 disabled:opacity-60">
            {submitting ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-300">
          Don’t have an account?{' '}
          <Link to="/register" className="font-semibold text-violet-300">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
