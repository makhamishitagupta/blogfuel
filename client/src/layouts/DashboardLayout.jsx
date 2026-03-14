import { Outlet } from 'react-router-dom';
import { Menu, LayoutDashboard, User, Heart, MessageSquare, Clock, FileText, Users, MessageCircle, BarChart3, PlusCircle, Megaphone } from 'lucide-react';
import { useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';

const DashboardLayout = ({ type }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const userLinks = [
    { to: '/dashboard/user', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/dashboard/user/profile', icon: User, label: 'Profile' },
    { to: '/dashboard/user/favorites', icon: Heart, label: 'Favorites' },
    { to: '/dashboard/user/comments', icon: MessageSquare, label: 'My Comments' },
    { to: '/dashboard/user/history', icon: Clock, label: 'Reading History' },
  ];

  const adminLinks = [
    { to: '/dashboard/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/dashboard/admin/create', icon: PlusCircle, label: 'Create Blog' },
    { to: '/dashboard/admin/blogs', icon: FileText, label: 'Manage Blogs' },
    { to: '/dashboard/admin/users', icon: Users, label: 'Manage Users' },
    { to: '/dashboard/admin/announcements', icon: Megaphone, label: 'Manage Announcements' },
    { to: '/dashboard/admin/comments', icon: MessageCircle, label: 'Moderate Comments' },
    { to: '/dashboard/admin/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  const links = type === 'admin' ? adminLinks : userLinks;
  const title = type === 'admin' ? 'Admin Dashboard' : 'User Dashboard';
  const subtitle =
    type === 'admin'
      ? 'Manage your blogging platform, content, and community.'
      : 'Keep track of your reading, favorites, and activity.';

  return (
    <div className="flex min-h-screen bg-slate-50 text-[var(--color-text)]">
      <button
        type="button"
        className="fixed left-4 top-4 z-30 inline-flex items-center rounded-full bg-white p-2 text-slate-700 shadow-md ring-1 ring-slate-200 transition md:hidden"
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div
        className={`fixed inset-y-0 left-0 z-20 transform bg-white/95 transition-transform duration-200 md:static md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
      >
        <Sidebar links={links} title={title} />
      </div>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="border-b border-slate-200 bg-white/70 px-4 py-4 backdrop-blur md:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
              <p className="mt-1 text-xs text-[var(--color-text-light)]">{subtitle}</p>
            </div>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

