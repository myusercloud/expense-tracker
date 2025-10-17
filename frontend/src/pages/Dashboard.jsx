import { useEffect, useState } from 'react';
import API from '../api/api';

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    API.get('/expenses')
      .then((res) => setExpenses(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container mt-4">
      <h3>My Expenses</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e.id}>
              <td>{e.title}</td>
              <td>${e.amount.toFixed(2)}</td>
              <td>{e.category?.name}</td>
              <td>{new Date(e.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
