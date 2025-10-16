import { useEffect, useState } from 'react';
import API from '../api/api.js';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    API.get('/expenses')
      .then(res => setExpenses(res.data))
      .catch(err => console.error(err));
  }, []);

  const data = {
    labels: expenses.map(e => e.title),
    datasets: [
      {
        label: 'Expense Amount',
        data: expenses.map(e => e.amount),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Navbar />
        <div className="container mt-4">
          <h3 className="mb-3">Dashboard Overview</h3>
          <div className="card p-3">
            <Bar data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
