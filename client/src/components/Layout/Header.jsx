import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex h-16 items-center justify-between">
          <h1 className="text-xl font-semibold text-primary-600">AI Journal</h1>

          <nav className="flex items-center gap-6">
            <NavLink
              to="/write"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              Write
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              History
            </NavLink>
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">PIN: {user?.pin}</span>
            <button
              onClick={logout}
              className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
