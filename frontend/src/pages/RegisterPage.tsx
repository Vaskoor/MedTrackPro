import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '', role: 'PATIENT' });
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) { alert('Registration failed'); }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <input type="text" placeholder="First Name" value={form.firstName} onChange={(e)=>setForm({...form, firstName: e.target.value})} className="w-full p-2 mb-4 border rounded" required />
        <input type="text" placeholder="Last Name" value={form.lastName} onChange={(e)=>setForm({...form, lastName: e.target.value})} className="w-full p-2 mb-4 border rounded" required />
        <input type="email" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} className="w-full p-2 mb-4 border rounded" required />
        <input type="password" placeholder="Password" value={form.password} onChange={(e)=>setForm({...form, password: e.target.value})} className="w-full p-2 mb-4 border rounded" required />
        <select value={form.role} onChange={(e)=>setForm({...form, role: e.target.value})} className="w-full p-2 mb-4 border rounded">
          <option value="PATIENT">Patient</option>
          <option value="DOCTOR">Doctor</option>
        </select>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Register</button>
        <p className="mt-4 text-center">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
      </form>
    </div>
  );
}
