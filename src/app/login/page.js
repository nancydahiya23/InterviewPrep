"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
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
        Access Your Interview Portal
      </h2>

      {/* Sub Text */}
      <p className="text-gray-400 text-sm mt-2 mb-6 text-center">
        Secure login required to continue.
      </p>

      <form onSubmit={handleLogin} className="space-y-4">

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 rounded-lg bg-white/20 placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded-lg bg-white/20 placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-2 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Login
        </button>
      </form>

      <p className="text-sm mt-4 text-center text-gray-400">
        Don't have an account?{" "}
        <a href="/signup" className="text-cyan-400 hover:underline">
          Signup
        </a>
      </p>

    </div>
  </div>
);
}