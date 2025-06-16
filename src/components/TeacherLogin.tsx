import React, { useState } from "react";
import { User } from "../types";
import { Users, BookOpen } from "lucide-react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";  // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css";  // Import styles for react-toastify

interface TeacherLoginProps {
  onLogin: (user: User) => void;
}

function TeacherLogin({ onLogin }: TeacherLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const q = query(
        collection(db, "users"),
        where("email", "==", email),
        where("role", "==", "teacher")
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
          toast.success("Login successful! Welcome to the dashboard."); // Show success message
        } else {
          toast.error("Invalid password, please try again."); // Show error message for incorrect password
        }
      } else {
        toast.error("Invalid teacher credentials."); // Show error message for incorrect email or role
      }
    } catch (err) {
      console.error("Teacher login error:", err);
      toast.error("Login failed, please try again."); // Show generic error message
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Users size={32} className="text-purple-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Teacher Login</h2>
          <p className="text-gray-600 mt-2">Access your teaching dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teacher Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="pl-10 w-full rounded-lg border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="your.email@teacher.com"
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
              className="w-full rounded-lg border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Sign in to dashboard
          </button>
        </form>
        <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-purple-600 hover:text-purple-800 font-medium">
            Register Now
          </a>
        </p>
</div>
      </div>

      {/* Add the ToastContainer component where notifications will be shown */}
      <ToastContainer />
    </div>
  );
}

export default TeacherLogin;
