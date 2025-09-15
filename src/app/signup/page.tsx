
"use client";

// 👉 Import dependencies
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";
import { signUpWithEmail, signInWithGoogle } from "@/services/auth-service";


function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.651-3.472-11.284-8.161l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        </svg>
    );
}

/* ---------------------------------------------------
   🔹 SIGNUP PAGE
   --------------------------------------------------- */
export default function SignupPage() {
  // form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }
    setError(null);
    setLoading(true);

    try {
      await signUpWithEmail(email, password, name);
      router.push("/dashboard"); // redirect after signup
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
          setError("This email is already registered. Please log in.");
      } else {
          setError("An error occurred during signup. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
        await signInWithGoogle();
        router.push('/dashboard');
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  }


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-var(--header-height))] px-4">
      <form
        onSubmit={handleSignup}
        className="p-6 shadow-lg rounded-xl w-full max-w-sm bg-card text-card-foreground border"
      >
        <h1 className="text-2xl font-bold mb-4 text-center font-headline">Create your Account</h1>
        {/* 🔴 Show errors */}
        {error && <p className="text-red-500 mb-4 text-sm text-center font-semibold">{error}</p>}

        {/* Name input */}
        <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">Name</label>
            <input
            id="name"
            type="text"
            placeholder="Your Name"
            className="w-full border p-2 rounded bg-background text-foreground"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            />
        </div>

        {/* Email input */}
         <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
            <input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            className="w-full border p-2 rounded bg-background text-foreground"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
        </div>

        {/* Password input */}
        <div className="mb-6 relative">
            <label htmlFor="password-signup" className="block text-sm font-medium text-muted-foreground mb-1">Password</label>
            <input
            id="password-signup"
            type={showPassword ? "text" : "password"}
            placeholder="At least 6 characters"
            className="w-full border p-2 rounded bg-background text-foreground pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-muted-foreground"
            >
                {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                <span className="sr-only">Toggle password visibility</span>
            </button>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-secondary text-secondary-foreground py-2 rounded hover:bg-secondary/90 transition-colors"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Create Account"}
        </button>

         <div className="flex items-center my-6">
            <Separator className="flex-1"/>
            <span className="px-4 text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1"/>
        </div>

        <Button onClick={handleGoogleSignIn} variant="outline" className="w-full" disabled={loading}>
            <GoogleIcon className="mr-2"/> Continue with Google
        </Button>

        {/* link to login */}
        <p className="mt-6 text-sm text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
