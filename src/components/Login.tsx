import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John Student',
    email: 'john@student.com',
    role: 'student'
  },
  {
    id: '2',
    name: 'Sarah Teacher',
    email: 'sarah@teacher.com',
    role: 'teacher'
  }
];

function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = MOCK_USERS.find(u => u.email === email);
    if (user) {
      onLogin(user);
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login to EduLearn</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Sign In
          </button>
        </form>
        <div className="mt-4 text-sm text-gray-600">
          <p>Demo Accounts:</p>
          <p>Student: john@student.com</p>
          <p>Teacher: sarah@teacher.com</p>
          <p>Password: any</p>
        </div>
      </div>
    </div>
  );
}

export default Login;