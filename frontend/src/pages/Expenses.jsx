import { useEffect, useState } from 'react';
import API from '../api/api.js';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    const res = await API.get('/expenses');
    setExpenses(res.data);
  };

  useEffect(() => { fetchExpenses(); }, []);

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Navbar />
        <div className="container mt-4">
          <h3>All Expenses</h3>
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(exp => (
                <tr key={exp.id}>
                  <td>{exp.title}</td>
                  <td>${exp.amount.toFixed(2)}</td>
                  <td>{new Date(exp.date).toLocaleDateString()}</td>
                  <td>{exp.category?.name || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
