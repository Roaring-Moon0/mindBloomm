
"use client";

// 👉 Import dependencies
import { useState } from "react";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

/* ---------------------------------------------------
   🔹 LOGIN PAGE
   --------------------------------------------------- */
export default function LoginPage() {
  // form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ Login using Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard"); // redirect after login
    } catch (err: any) {
      setError(err.message); // show error if login fails
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleLogin}
        className="p-6 shadow-lg rounded-xl w-96 bg-card text-card-foreground"
      >
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        {/* 🔴 Show errors */}
        {error && <p className="text-red-500 mb-2">{error}</p>}

        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3 rounded bg-background text-foreground"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3 rounded bg-background text-foreground"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-2 rounded hover:bg-primary/90"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* link to signup */}
        <p className="mt-3 text-sm">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
