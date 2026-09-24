import { useEffect, useState } from 'react';
import { getUsers } from '../api/userApi';
import { getReviewsByUser } from '../api/reviewApi';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAdminData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const [usersResponse, reviewsResponse] = await Promise.all([
          getUsers(),
          getReviewsByUser(user.id),
        ]);

        setUsers(usersResponse.data || []);
        setReviews(reviewsResponse.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to load admin data.');
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [user?.id]);

  if (user?.role !== 'ADMIN') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-white">Access denied</h1>
        <p className="mt-3 text-slate-300">This area is reserved for administrators.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white">Admin dashboard</h1>

      {loading ? (
        <div className="mt-8"><Spinner label="Loading admin data..." /></div>
      ) : error ? (
        <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-red-200">{error}</div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
            <h2 className="text-xl font-semibold text-white">Users</h2>
            <div className="mt-4 space-y-3">
              {users.map((account) => (
                <div key={account.id} className="rounded-lg border border-white/10 bg-slate-950/60 p-3">
                  <p className="font-semibold text-white">{account.name || account.email}</p>
                  <p className="text-sm text-slate-400">{account.email}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-violet-300">{account.role}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
            <h2 className="text-xl font-semibold text-white">Your reviews</h2>
            <div className="mt-4 space-y-3">
              {reviews.length === 0 ? (
                <p className="text-slate-300">No reviews available.</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="rounded-lg border border-white/10 bg-slate-950/60 p-3">
                    <p className="font-semibold text-white">Movie #{review.movieId}</p>
                    <p className="text-sm text-slate-300">{review.rating}/5</p>
                    <p className="mt-2 text-slate-300">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
