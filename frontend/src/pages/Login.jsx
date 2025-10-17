import { useState } from 'react';
import API from '../api/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await API.post('/auth/login', form);
    // Save ONLY the token
    localStorage.setItem('token', res.data.token);
    window.location.href = '/Dashboard'; // redirect after login
  } catch (err) {
    alert('Invalid credentials');
  }
};


  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h3 className="mb-3">Login</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="form-control mb-2"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
}
