import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import HomePage from './components/HomePage';
import StudentLogin from './components/StudentLogin';
import Courses from './components/Courses';
import TeacherLogin from './components/TeacherLogin';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import { User } from './types';
import Register from './components/Register';

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white text-gray-800 shadow-md p-4">
          <div className="container mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap size={24} />
              <span className="text-xl font-bold">E-Learning</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link to="/courses" className="text-indigo-600 hover:underline">
                Courses
              </Link>

              {user ? (
                <>
                  <span>Welcome, {user.name}</span>
                  <button
                    onClick={() => setUser(null)}
                    className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-400"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login/student"
                    className="text-indigo-600 hover:underline"
                  >
                    Student Login
                  </Link>
                  <Link
                    to="/login/teacher"
                    className="text-indigo-600 hover:underline"
                  >
                    Teacher Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route
            path="/"
            element={
              !user ? (
                <HomePage />
              ) : (
                <Navigate
                  to={user.role === 'student' ? '/student' : '/teacher'}
                  replace
                />
              )
            }
          />
          <Route
            path="/login/student"
            element={
              !user ? (
                <StudentLogin onLogin={handleLogin} />
              ) : (
                <Navigate to="/student" replace />
              )
            }
          />
          <Route
            path="/login/teacher"
            element={
              !user ? (
                <TeacherLogin onLogin={handleLogin} />
              ) : (
                <Navigate to="/teacher" replace />
              )
            }
          />
          <Route
            path="/student"
            element={
              user?.role === 'student' ? (
                <StudentDashboard user={user} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/teacher"
            element={
              user?.role === 'teacher' ? (
                <TeacherDashboard user={user} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/courses" element={<Courses user={user} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
