"use client";

import { useState } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Account created successfully!");
      localStorage.setItem("token", data.token);
      window.location.href = "/interview";
    } else {
      alert(data.message);
    }
  };

 return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white">
    
    <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-xl w-96 shadow-2xl border border-white/10">

      {/* App Name */}
      <h1 className="text-2xl font-bold text-indigo-400 text-center">
        Interview Preparation Portal
      </h1>

      {/* Main Heading */}
      <h2 className="text-lg font-semibold text-white text-center mt-2">
        Create Your Account
      </h2>

      {/* Sub Text */}
      <p className="text-gray-400 text-sm mt-2 mb-6 text-center">
        Start your interview preparation journey.
      </p>

      <form onSubmit={handleSignup} className="space-y-4">

        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-2 rounded-lg bg-white/20 placeholder-gray-300 outline-none focus:ring-2 focus:ring-cyan-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 rounded-lg bg-white/20 placeholder-gray-300 outline-none focus:ring-2 focus:ring-cyan-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded-lg bg-white/20 placeholder-gray-300 outline-none focus:ring-2 focus:ring-cyan-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-2 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Create Account
        </button>
      </form>

      <p className="text-sm mt-4 text-center text-gray-400">
        Already have an account?{" "}
        <a href="/login" className="text-indigo-400 hover:underline">
          Login
        </a>
      </p>

    </div>
  </div>
);
}