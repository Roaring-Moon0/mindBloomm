
"use client";

// 👉 Import dependencies
import { useState, Suspense } from "react";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Loader2 } from "lucide-react";

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.651-3.472-11.284-8.161l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        </svg>
    );
}

function LoginForm() {
  // form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // ✅ Login using Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);
      router.push(redirect); // redirect after login
    } catch (err: any) {
       switch (err.code) {
        case "auth/user-not-found":
          setError("No account found with this email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        case "auth/invalid-credential":
           setError("The email or password you entered is incorrect.");
           break;
        default:
          setError("An unexpected error occurred. Please try again.");
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        router.push(redirect);
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  }

  return (
    <form
        onSubmit={handleLogin}
        className="p-6 shadow-lg rounded-xl w-full max-w-sm bg-card text-card-foreground border"
      >
        <h1 className="text-2xl font-bold mb-4 text-center font-headline">Login to MindBloom</h1>
        {/* 🔴 Show errors */}
        {error && <p className="text-red-500 mb-4 text-sm text-center font-semibold">{error}</p>}

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
             <div className="flex justify-between items-center mb-1">
                <label htmlFor="password-login" className="block text-sm font-medium text-muted-foreground">Password</label>
                <Link href="/forgot-password" passHref className="text-xs text-primary hover:underline">
                    Forgot Password?
                </Link>
            </div>
            <input
            id="password-login"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
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
          className="w-full bg-primary text-primary-foreground py-2 rounded hover:bg-primary/90 transition-colors"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="flex items-center my-6">
            <Separator className="flex-1"/>
            <span className="px-4 text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1"/>
        </div>

        <Button onClick={handleGoogleSignIn} variant="outline" className="w-full" disabled={loading}>
            <GoogleIcon className="mr-2"/> Continue with Google
        </Button>


        {/* link to signup */}
        <p className="mt-6 text-sm text-center">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </form>
  )
}

/* ---------------------------------------------------
   🔹 LOGIN PAGE
   --------------------------------------------------- */
export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-var(--header-height))] px-4">
      <Suspense fallback={<div className="w-full max-w-sm flex justify-center items-center h-96"><Loader2 className="w-8 h-8 animate-spin"/></div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
