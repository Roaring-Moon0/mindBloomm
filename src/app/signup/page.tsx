
"use client";

// 👉 Import dependencies
import { useState } from "react";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

/* ---------------------------------------------------
   🔹 SIGNUP PAGE
   --------------------------------------------------- */
export default function SignupPage() {
  // form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ Create user with Firebase Auth
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard"); // redirect after signup
    } catch (err: any) {
      setError(err.message); // show error if signup fails
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSignup}
        className="p-6 shadow-lg rounded-xl w-96 bg-card text-card-foreground"
      >
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
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
          className="w-full bg-secondary text-secondary-foreground py-2 rounded hover:bg-secondary/90"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        {/* link to login */}
        <p className="mt-3 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
