import React, { useState } from "react";
import { User } from "../types";
import { GraduationCap, BookOpen } from "lucide-react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import styles for react-toastify
import { Link } from "react-router-dom"; // Import Link from react-router-dom

interface StudentLoginProps {
  onLogin: (user: User) => void;
}

function StudentLogin({ onLogin }: StudentLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const q = query(
        collection(db, "users"),
        where("email", "==", email),
        where("role", "==", "student")
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data();
        const storedPassword = data.password; // Fetch the password stored in Firestore

        if (storedPassword === password) {
          const user: User = {
            id: doc.id,
            name: data.name,
            email: data.email,
            role: data.role
          };
          onLogin(user);
          toast.success("Login successful! Welcome back."); // Success notification
        } else {
          toast.error("Invalid password, please try again."); // Error notification for incorrect password
        }
      } else {
        toast.error("Invalid student credentials."); // Error notification for incorrect email or role
      }
    } catch (err) {
      console.error("Student login error:", err);
      toast.error("Login failed, please try again."); // Generic error notification
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <GraduationCap size={32} className="text-indigo-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Student Login</h2>
          <p className="text-gray-600 mt-2">Welcome back, continue your learning journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="pl-10 w-full rounded-lg border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="your.email@student.com"
                required
              />
              <BookOpen className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign in to your account
          </button>

          {/* Register link */}
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">Don't have an account?</span>{" "}
            <Link
              to="/register"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Register Now
            </Link>
          </div>
        </form>
      </div>

      {/* Add the ToastContainer component for showing notifications */}
      <ToastContainer />
    </div>
  );
}

export default StudentLogin;
