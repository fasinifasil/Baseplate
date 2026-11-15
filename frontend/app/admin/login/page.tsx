
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/token/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError("Incorrect username or password.");
        return;
      }

      sessionStorage.setItem("baseplate_access", data.access);
      sessionStorage.setItem("baseplate_refresh", data.refresh);

      router.push("/admin");
    } catch {
      setError("Cannot connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f1e7] px-5 py-12 text-[#26351f]">

      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full border border-[#d8d8c6]" />

      <div className="pointer-events-none absolute -bottom-40 -right-32 h-[500px] w-[500px] rounded-full border border-[#d8d8c6]" />

      {/* Login card */}
      <div className="relative w-full max-w-md rounded-2xl border border-[#dedbcf] bg-white p-9 shadow-xl">

        {/* Baseplate UAE logo */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/images/design.jpeg"
            alt="Baseplate UAE Logo"
            width={220}
            height={120}
            priority
            className="h-auto max-h-28 w-[200px] object-contain"
          />
        </div>

        {/* Heading */}
        <div className="mb-9 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#89905d]">
            WEBSITE MANAGEMENT
          </p>

          <h1 className="mt-5 font-serif text-4xl">
            Welcome back.
          </h1>

          <p className="mt-3 text-sm text-stone-500">
            Sign in to manage your website.
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium"
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              placeholder="Enter your username"
              className="w-full rounded-lg border border-stone-300 bg-[#faf9f5] px-4 py-3 outline-none transition focus:border-[#78834e] focus:ring-2 focus:ring-[#78834e]/10"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full rounded-lg border border-stone-300 bg-[#faf9f5] px-4 py-3 outline-none transition focus:border-[#78834e] focus:ring-2 focus:ring-[#78834e]/10"
            />
          </div>

          {/* Error message */}
          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              {error}
            </p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#35452c] py-3.5 text-sm font-semibold text-white transition duration-300 hover:bg-[#526442] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 border-t border-stone-100 pt-6 text-center">
          <p className="text-xs tracking-wide text-stone-400">
            BASEPLATE UAE · Website Management
          </p>
        </div>

      </div>
    </main>
  );
}
