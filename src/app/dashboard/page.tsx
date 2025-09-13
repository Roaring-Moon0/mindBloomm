
"use client";

// 👉 Import dependencies
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

/* ---------------------------------------------------
   🔹 DASHBOARD PAGE
   --------------------------------------------------- */
export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null); // user object
  const [loading, setLoading] = useState(true); // loading state
  const router = useRouter();

  // ✅ Listen to auth state (check if logged in)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser); // logged in
      } else {
        router.push("/login"); // not logged in → redirect
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Logout function
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
      <p className="mt-2">Logged in as: {user?.email}</p>

      <button
        onClick={handleLogout}
        className="mt-4 bg-destructive text-destructive-foreground px-4 py-2 rounded hover:bg-destructive/90"
      >
        Logout
      </button>
    </div>
  );
}
