
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


const formSchema = z.object({
  employeeCode: z.string().min(4, { message: "Please enter a valid employee code." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

// These are your new admin credentials.
// IMPORTANT: For security, you should log into the Firebase console and change these passwords.
const adminCredentials = [
    { code: "MB-A1B2", password: "mB!aDmiN$24pW#1" },
    { code: "MB-C3D4", password: "gR@v!sEcUre#9k1" },
    { code: "MB-E5F6", password: "kRtk@sTr0Ng!pW7" },
    { code: "MB-G7H8", password: "aBnv@c0dE$pW%5" },
    { code: "MB-I9J0", password: "dRv!pAsS#w@Rd*3" },
    { code: "MB-K1L2", password: "sHbm@aCcEsS!qZ9" },
];

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeCode: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    // Map the employee code to a secure email format
    const email = `${values.employeeCode.toLowerCase()}@mindbloom.app`;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, values.password);
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
        errorMessage = "Invalid employee code or password. Please try again.";
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
            <AlertTitle>Admin Credentials</AlertTitle>
            <AlertDescription>
                <p className="mb-2">Use one of the following credentials to log in. You can change the passwords in the Firebase console.</p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                    {adminCredentials.map(cred => (
                       <li key={cred.code}><strong>Code:</strong> {cred.code} / <strong>Password:</strong> {cred.password}</li>
                    ))}
                </ul>
            </AlertDescription>
          </Alert>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="employeeCode" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Code</FormLabel>
                    <FormControl><Input placeholder="MB-A1B2" {...field} /></FormControl>
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
