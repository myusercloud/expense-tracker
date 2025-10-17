import { useEffect, useState } from 'react';
import API from '../api/api.js';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart, BarElement, LineElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement } from 'chart.js';
Chart.register(BarElement, LineElement, PointElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Dashboard() {
  const [data, setData] = useState({ total: 0, monthly: [], categories: [], recent: [] });

  useEffect(() => {
    API.get('/analytics/dashboard')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  const barData = {
    labels: data.categories.map(c => c.name),
    datasets: [{ label: 'By Category', data: data.categories.map(c => c.total), backgroundColor: 'rgba(54,162,235,0.6)' }],
  };

  const lineData = {
    labels: data.monthly.map(m => new Date(m.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })),
    datasets: [{ label: 'Monthly Spending', data: data.monthly.map(m => m.total), borderColor: 'rgba(75,192,192,1)', fill: false }],
  };

  const doughnutData = {
    labels: data.categories.map(c => c.name),
    datasets: [{ data: data.categories.map(c => c.total), backgroundColor: ['#36A2EB','#FF6384','#FFCE56','#4BC0C0','#9966FF','#FF9F40'] }],
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Navbar />
        <div className="container mt-4">
          <h3 className="mb-4">Dashboard Overview</h3>

          {/* KPI Section */}
          <div className="row text-center mb-4">
            <div className="col-md-3"><div className="card p-3 shadow-sm"><h5>Total Expenses</h5><h4>${data.total.toFixed(2)}</h4></div></div>
            <div className="col-md-3"><div className="card p-3 shadow-sm"><h5>Top Category</h5><h4>{data.categories[0]?.name || '—'}</h4></div></div>
            <div className="col-md-3"><div className="card p-3 shadow-sm"><h5>Entries</h5><h4>{data.recent.length}</h4></div></div>
            <div className="col-md-3"><div className="card p-3 shadow-sm"><h5>Active Months</h5><h4>{data.monthly.length}</h4></div></div>
          </div>

          {/* Charts */}
          <div className="row">
            <div className="col-lg-6 mb-4"><div className="card p-3 shadow-sm"><h6>Expenses by Category</h6><Bar data={barData} /></div></div>
            <div className="col-lg-6 mb-4"><div className="card p-3 shadow-sm"><h6>Spending Trend</h6><Line data={lineData} /></div></div>
          </div>

          {/* Breakdown */}
          <div className="row">
            <div className="col-lg-4 mb-4"><div className="card p-3 shadow-sm"><h6>Category Breakdown</h6><Doughnut data={doughnutData} /></div></div>
            <div className="col-lg-8 mb-4">
              <div className="card p-3 shadow-sm">
                <h6>Recent Expenses</h6>
                <table className="table table-striped table-sm mt-2">
                  <thead><tr><th>Title</th><th>Category</th><th>Date</th><th>Amount</th></tr></thead>
                  <tbody>
                    {data.recent.map(e => (
                      <tr key={e.id}>
                        <td>{e.title}</td>
                        <td>{e.category?.name}</td>
                        <td>{new Date(e.date).toLocaleDateString()}</td>
                        <td>${e.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
