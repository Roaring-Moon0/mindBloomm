"use client";

import { useState } from "react";
import { useAdminAuth } from "@/hooks/use-admin-auth";

export default function AdminPage() {
  const { user, isAdmin, loading, error, verifyCode, logout } = useAdminAuth();
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please log in first.</p>;

  // Case 2: user logged in but not admin yet → show code input
  if (user && !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-xl font-bold">Enter Admin Code</h1>
        <input
          type="text"
          placeholder="Enter admin code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border p-2 rounded mt-4"
        />
        <button
          onClick={async () => {
            setVerifying(true);
            const success = await verifyCode(code);
            setVerifying(false);
            if (!success) alert("Invalid code, try again.");
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        >
          {verifying ? "Verifying..." : "Verify"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <button onClick={logout} className="mt-4 text-sm underline">
          Logout
        </button>
      </div>
    );
  }

  // Case 3: admin verified
  if (user && isAdmin) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Welcome Admin {user.email}</h1>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded mt-4"
        >
          Logout
        </button>
        {/* your admin dashboard goes here */}
      </div>
    );
  }

  return null;
}
