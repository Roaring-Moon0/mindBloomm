
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


const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid admin email." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      // Check if user is an admin
      const adminConfigDoc = await getDoc(doc(db, 'config', 'admins'));
      if (adminConfigDoc.exists()) {
        const adminEmails = adminConfigDoc.data().emails as string[];
        if (user.email && adminEmails.includes(user.email)) {
          toast({
            title: "Admin Login Successful!",
            description: "Welcome to the dashboard.",
          });
          router.push("/admin");
        } else {
          await auth.signOut();
          throw new Error("You are not authorized to access this page.");
        }
      } else {
         await auth.signOut();
         throw new Error("Admin configuration not found.");
      }

    } catch (error: any) {
      console.error("Admin login error:", error);
      let errorMessage = "An unknown error occurred. Please try again.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.message.includes("not authorized")) {
        errorMessage = "You do not have permission to access the admin dashboard.";
      } else if (error.message.includes("Admin configuration not found")) {
        errorMessage = "The admin system is not configured. Please contact support.";
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
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo className="w-10 h-10 text-primary"/>
          </div>
          <CardTitle>Admin Panel</CardTitle>
          <CardDescription>Login to manage MindBloom content.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Admin Access</AlertTitle>
            <AlertDescription>
                <p>Please use your designated admin email and password. To gain access, an existing administrator must add your email to the approved list in the Firestore `config/admins` document.</p>
                <p className="mt-2">New admins should sign up through the regular <Link href="/signup" className="underline">sign-up page</Link> first.</p>
            </AlertDescription>
          </Alert>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input placeholder="admin@example.com" {...field} /></FormControl>
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Log In as Admin"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
