import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';

export default function Profile() {
  const user = JSON.parse(localStorage.getItem('user')) || {};

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Navbar />
        <div className="container mt-4">
          <h3>Profile</h3>
          <div className="card p-4 mt-3">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Joined:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
