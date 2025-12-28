import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100';
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', roles: ['ADMIN', 'TEACHER', 'STUDENT'] },
    { path: '/students', label: 'Students', roles: ['ADMIN', 'TEACHER'] },
    { path: '/courses', label: 'Courses', roles: ['ADMIN', 'TEACHER', 'STUDENT'] },
    { path: '/attendance', label: 'Attendance', roles: ['ADMIN', 'TEACHER', 'STUDENT'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {filteredMenuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`block px-4 py-3 rounded-lg transition-colors duration-200 font-medium ${isActive(item.path)}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;