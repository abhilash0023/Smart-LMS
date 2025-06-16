import React, { useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import styles for react-toastify

function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [passwordError, setPasswordError] = useState<string>("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);

    if (passwordValue.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
    } else {
      setPasswordError("");
    }
  };

  const handleRoleToggle = () => {
    setRole((prevRole) => (prevRole === "student" ? "teacher" : "student"));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordError) {
      toast.error("Please fix the password error before submitting.");
      return;
    }

    try {
      // Check if email already exists
      const q = query(collection(db, "users"), where("email", "==", email));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        toast.error("Email is already registered, please use a different email.");
        return;
      }

      // If email doesn't exist, proceed with registration
      const userRef = collection(db, "users");
      await addDoc(userRef, {
        email,
        name,
        password,
        role,
      });

      toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} registration successful!`);
      setEmail("");
      setName("");
      setPassword("");
      setRole("student"); // Reset to student after successful registration
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Registration failed, please try again.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Register</h2>
          <p className="text-gray-600 mt-2">Create your account and start learning or teaching</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="youremail@domain.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="••••••••"
              required
            />
            {passwordError && (
              <p className="text-sm text-red-500 mt-1">{passwordError}</p>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <div className="flex items-center">
              <label htmlFor="student" className="mr-2">
                Student
              </label>
              <input
                id="student"
                type="radio"
                name="role"
                checked={role === "student"}
                onChange={handleRoleToggle}
                className="mr-2"
              />
              <label htmlFor="teacher" className="mr-2">
                Teacher
              </label>
              <input
                id="teacher"
                type="radio"
                name="role"
                checked={role === "teacher"}
                onChange={handleRoleToggle}
                className="mr-2"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={passwordError !== ""}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
              passwordError ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            Register
          </button>
        </form>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default Register;
