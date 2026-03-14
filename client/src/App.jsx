import { Route, Routes, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import Home from './pages/Home.jsx';
import BlogDetails from './pages/BlogDetails.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import SearchResults from './pages/SearchResults.jsx';
import Announcements from './pages/Announcements.jsx';
import NotFound from './pages/NotFound.jsx';
import AdminDashboard from './dashboard/admin/AdminDashboard.jsx';
import CreateBlog from './dashboard/admin/CreateBlog.jsx';
import ManageBlogs from './dashboard/admin/ManageBlogs.jsx';
import EditBlog from './dashboard/admin/EditBlog.jsx';
import ManageUsers from './dashboard/admin/ManageUsers.jsx';
import ModerateComments from './dashboard/admin/ModerateComments.jsx';
import ManageAnnouncements from './dashboard/admin/ManageAnnouncements.jsx';
import AdminAnalytics from './dashboard/admin/AdminAnalytics.jsx';
import UserDashboard from './dashboard/user/UserDashboard.jsx';
import Profile from './dashboard/user/Profile.jsx';
import Favorites from './dashboard/user/Favorites.jsx';
import MyComments from './dashboard/user/MyComments.jsx';
import ReadingHistory from './dashboard/user/ReadingHistory.jsx';
import { useAuth } from './context/AuthContext.jsx';

const RequireAuth = ({ children, role }) => {
  const { isAuthenticated, loading, role: userRole } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-[var(--color-text-light)]">
        Checking session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    const redirectTo = userRole === 'admin' ? '/dashboard/admin' : '/dashboard/user';
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<MainLayout />}
      >
        <Route index element={<Home />} />
        <Route path="blog/:id" element={<BlogDetails />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="announcements" element={<Announcements />} />
      </Route>

      <Route
        path="/"
        element={<MainLayout />}
      >
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route
        path="/dashboard/user"
        element={
          <RequireAuth role="user">
            <DashboardLayout type="user" />
          </RequireAuth>
        }
      >
        <Route index element={<UserDashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="comments" element={<MyComments />} />
        <Route path="history" element={<ReadingHistory />} />
      </Route>

      <Route
        path="/dashboard/admin"
        element={
          <RequireAuth role="admin">
            <DashboardLayout type="admin" />
          </RequireAuth>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="create" element={<CreateBlog />} />
        <Route path="blogs" element={<ManageBlogs />} />
        <Route path="blogs/:id/edit" element={<EditBlog />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="comments" element={<ModerateComments />} />
        <Route path="announcements" element={<ManageAnnouncements />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
