import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchResults from './pages/SearchResults';
import MovieDetails from './pages/MovieDetails';
import TvDetails from './pages/TvDetails';
import Favorites from './pages/Favorites';
import Reviews from './pages/Reviews';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import GenreResults from './pages/GenreResults';
import DiscoveryPage from './pages/DiscoveryPage';
import { getIndianMovies, getTrending, getTvShows } from './api/tmdbApi';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
          <div>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<SearchResults />} />
              <Route
                path="/movies"
                element={<DiscoveryPage title="Movies" subtitle="Discover Movies" fetchFn={getTrending} defaultMediaType="movie" />}
              />
              <Route
                path="/tv-shows"
                element={<DiscoveryPage title="TV Shows" subtitle="Binge-Worthy Series" fetchFn={getTvShows} defaultMediaType="tv" />}
              />
              <Route
                path="/trending"
                element={<DiscoveryPage title="Trending Today" subtitle="Popular Worldwide" fetchFn={getTrending} />}
              />
              <Route
                path="/indian-movies"
                element={<DiscoveryPage title="Indian Movies" subtitle="Cinema of India" fetchFn={getIndianMovies} defaultMediaType="movie" />}
              />
              <Route path="/genre/:genreId" element={<GenreResults />} />
              <Route path="/discover/movie" element={<GenreResults />} />
              <Route path="/movie/:tmdbId" element={<MovieDetails />} />
              <Route path="/tv/:tmdbId" element={<TvDetails />} />
              <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
              <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
