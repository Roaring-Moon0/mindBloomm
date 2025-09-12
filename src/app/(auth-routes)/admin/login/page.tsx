
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import Logo from "@/components/icons/Logo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import Link from "next/link";
import { verifyAndClaimAdminCode } from "@/services/config-service";


const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid admin email." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  adminCode: z.string().min(4, { message: "Please enter your unique admin code." }),
});

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      adminCode: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      // 1. Authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      // 2. Check if user's email is on the admin list
      const adminConfigDoc = await getDoc(doc(db, 'config', 'admins'));
      if (!adminConfigDoc.exists() || !adminConfigDoc.data().emails?.includes(user.email)) {
         await auth.signOut();
         throw new Error("You are not authorized to access this page.");
      }
      
      // 3. Verify the admin code and claim it if it's the first time
      const isCodeValid = await verifyAndClaimAdminCode(user.uid, values.adminCode);
      if (!isCodeValid) {
        await auth.signOut();
        throw new Error("The admin code is invalid, has expired, or is already in use.");
      }

      // All checks passed
      toast({
        title: "Admin Login Successful!",
        description: "Welcome to the dashboard.",
      });
      router.push("/admin");

    } catch (error: any) {
      console.error("Admin login error:", error);
      let errorMessage = "An unknown error occurred. Please try again.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.message.includes("not authorized")) {
        errorMessage = "You do not have permission to access the admin dashboard.";
      } else if (error.message.includes("admin code")) {
        errorMessage = error.message;
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
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <Link href="/" aria-label="Back to home">
              <Logo className="w-10 h-10 text-primary"/>
            </Link>
          </div>
          <CardTitle>Admin Panel</CardTitle>
          <CardDescription>Use your credentials and unique admin code to log in.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Secure Admin Access</AlertTitle>
            <AlertDescription>
                <p>Your email must be on the approved admin list, and you must provide a valid, unclaimed admin code. If you don't have an account, please <Link href="/signup" className="underline">sign up</Link> first.</p>
            </AlertDescription>
          </Alert>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input placeholder="your.email@example.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="adminCode" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Code</FormLabel>
                    <FormControl><Input placeholder="bl00m-adm-xxxx" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Log In as Admin"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
