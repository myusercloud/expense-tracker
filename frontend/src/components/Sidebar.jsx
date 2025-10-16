import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const links = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/expenses', label: 'Expenses' },
    { path: '/categories', label: 'Categories' },
    { path: '/profile', label: 'Profile' },
  ];

  return (
    <div className="bg-light border-end vh-100 p-3" style={{ width: '220px' }}>
      <h5 className="mb-4 text-dark">Menu</h5>
      <ul className="nav flex-column">
        {links.map(link => (
          <li key={link.path} className="nav-item">
            <Link
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active fw-bold' : 'text-dark'}`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
