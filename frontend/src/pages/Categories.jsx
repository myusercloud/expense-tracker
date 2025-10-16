import { useEffect, useState } from 'react';
import API from '../api/api.js';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    API.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Navbar />
        <div className="container mt-4">
          <h3>Categories</h3>
          <ul className="list-group mt-3">
            {categories.map(cat => (
              <li key={cat.id} className="list-group-item d-flex justify-content-between">
                <span>{cat.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
