
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const resetPasswordFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email to send a reset link." }),
});

const GoogleIcon = () => (
    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25C22.56 11.45 22.49 10.68 22.36 9.92H12V14.45H18.02C17.72 16.03 16.85 17.41 15.49 18.33V20.94H19.51C21.45 19.12 22.56 16.03 22.56 12.25Z" fill="#4285F4"/>
      <path d="M12 23C14.97 23 17.47 22.02 19.51 20.94L15.49 18.33C14.51 18.96 13.33 19.34 12 19.34C9.48 19.34 7.33 17.75 6.53 15.47L2.43 15.47V18.15C4.48 21.05 7.97 23 12 23Z" fill="#34A853"/>
      <path d="M6.53 15.47C6.35 14.97 6.25 14.44 6.25 13.88C6.25 13.31 6.35 12.78 6.53 12.28V9.59L2.43 9.59C1.52 11.29 1 12.98 1 14.88C1 16.78 1.52 18.47 2.43 20.17L6.53 15.47Z" fill="#FBBC05"/>
      <path d="M12 6.13C13.41 6.13 14.63 6.63 15.63 7.56L19.59 3.94C17.47 1.98 14.97 1 12 1C7.97 1 4.48 2.95 2.43 5.85L6.53 8.53C7.33 6.25 9.48 4.66 12 4.66" fill="#EA4335"/>
    </svg>
);

function ForgotPasswordDialog({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
    const [isSending, setIsSending] = useState(false);
    const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
        resolver: zodResolver(resetPasswordFormSchema),
        defaultValues: { email: "" },
    });

    async function onSubmit(values: z.infer<typeof resetPasswordFormSchema>) {
        setIsSending(true);
        try {
            await sendPasswordResetEmail(auth, values.email);
            toast({
                title: "Reset Email Sent",
                description: "If an account exists for this email, you will receive a password reset link. Please check your inbox (and spam folder).",
            });
            onOpenChange(false); // Close the dialog on success
        } catch (error: any) {
            let description = "An unexpected error occurred. Please try again.";
            // For security, Firebase's sendPasswordResetEmail might not throw 'auth/user-not-found' on the client.
            // We now show a clearer message to the user.
            if (error.code === 'auth/user-not-found') {
              description = "No account found with this email address. Please double-check your email or sign up.";
            }
            console.error("Password Reset Error:", error.code);
            toast({
                variant: "destructive",
                title: "Failed to Send Email",
                description,
            });
        } finally {
            setIsSending(false);
        }
    }
    
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Reset Your Password</DialogTitle>
                <DialogDescription>
                    Enter your email address below. If an account exists, we'll send you a link to reset your password.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="your.email@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={isSending}>
                        {isSending ? "Sending..." : "Send Reset Link"}
                    </Button>
                </form>
            </Form>
        </DialogContent>
    );
}


export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        router.push(redirectUrl);
        toast({
            title: "Login Successful!",
            description: "Welcome back.",
        });
    } catch (error: any) {
        console.error("Google Sign-in error:", error);
        let description = "Could not complete the sign-in process. Please try again.";
        if (error.code === 'auth/popup-closed-by-user') {
            description = "Sign-in was canceled. Please try again when you're ready.";
        }
        toast({
            variant: "destructive",
            title: "Google Sign-In Failed",
            description: description,
        });
    } finally {
        setIsGoogleLoading(false);
    }
  };

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: "Login Successful!",
        description: "Welcome back.",
      });
      router.push(redirectUrl);
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "An unknown error occurred. Please try again.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid email or password. Please try again.";
      }
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Welcome Back!</CardTitle>
          <CardDescription>Log in to your MindBloom account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" placeholder="your.email@example.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                        <FormLabel>Password</FormLabel>
                         <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
                            <DialogTrigger asChild>
                                <Button variant="link" type="button" className="p-0 h-auto text-xs">Forgot password?</Button>
                            </DialogTrigger>
                            <ForgotPasswordDialog onOpenChange={setIsForgotPasswordOpen} />
                        </Dialog>
                    </div>
                    <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </Form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading || isGoogleLoading}>
            {isGoogleLoading ? (
              "Signing in..."
            ) : (
              <>
                <GoogleIcon />
                Continue with Google
              </>
            )}
          </Button>

           <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="underline hover:text-primary">
                Sign up
              </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
    
