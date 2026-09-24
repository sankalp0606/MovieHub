import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const { name, email, password, confirmPassword } = form;

    if (!name || !email || !password || !confirmPassword) {
      setError('Please complete all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    try {
      const result = await signup({ name: name.trim(), email: email.trim(), password });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      setSuccess('Registration successful. You can sign in now.');
      setTimeout(() => navigate('/login', { replace: true }), 900);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white">Create account</h1>
        <p className="mt-2 text-slate-300">Join the app and start tracking your favorites.</p>

        {error && <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-red-200">{error}</div>}
        {success && <div className="mt-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-200">{success}</div>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-sm text-slate-200">Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none placeholder:text-slate-500" placeholder="Jane Doe" required />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-200">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none placeholder:text-slate-500" placeholder="you@example.com" required />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-200">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none placeholder:text-slate-500" placeholder="••••••••" required />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-200">Confirm password</label>
            <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-3 text-white outline-none placeholder:text-slate-500" placeholder="••••••••" required />
          </div>

          <button type="submit" disabled={submitting} className="w-full rounded-lg bg-violet-500 px-4 py-3 font-semibold text-white hover:bg-violet-400 disabled:opacity-60">
            {submitting ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-300">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-violet-300">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
