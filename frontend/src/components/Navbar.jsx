import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/dashboard">ExpenseTracker</Link>
        <button className="btn btn-outline-light ms-auto" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
