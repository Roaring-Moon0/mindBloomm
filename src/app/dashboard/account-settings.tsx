
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { reauthenticateWithPassword, updateUserEmail, updateUserPassword, updateUserProfile } from '@/services/auth-service';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';


// Schemas
const profileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters."),
  photoURL: z.string().url("Please enter a valid URL.").or(z.literal('')),
});

const emailSchema = z.object({
  newEmail: z.string().email("Please enter a valid email address."),
});

const passwordSchema = z.object({
    newPassword: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});

const reauthSchema = z.object({
    password: z.string().min(1, "Password is required."),
});


export default function AccountSettings() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [reauthAction, setReauthAction] = useState<(() => Promise<void>) | null>(null);

    const profileForm = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            displayName: user?.displayName ?? '',
            photoURL: user?.photoURL ?? '',
        }
    });

    const emailForm = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: { newEmail: '' }
    });

    const passwordForm = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { newPassword: '', confirmPassword: '' }
    });

    const reauthForm = useForm<z.infer<typeof reauthSchema>>({
        resolver: zodResolver(reauthSchema),
        defaultValues: { password: '' }
    });

    // --- Handlers ---
    const handleProfileUpdate = async (values: z.infer<typeof profileSchema>) => {
        setIsLoading(true);
        try {
            await updateUserProfile(values);
            toast({ title: "Success", description: "Your profile has been updated." });
        } catch (error: any) {
            toast({ variant: 'destructive', title: "Error", description: error.message });
        } finally {
            setIsLoading(false);
        }
    };
    
    const initiateEmailChange = (values: z.infer<typeof emailSchema>) => {
        const action = async () => {
            try {
                await updateUserEmail(values.newEmail);
                toast({ title: "Verification Sent", description: `A verification link has been sent to ${values.newEmail}. Please check your inbox.` });
                emailForm.reset();
            } catch (error: any) {
                toast({ variant: 'destructive', title: "Error", description: error.message });
            }
        };
        setReauthAction(() => action); // Use function form to ensure latest state
    };
    
    const initiatePasswordChange = (values: z.infer<typeof passwordSchema>) => {
        const action = async () => {
            try {
                await updateUserPassword(values.newPassword);
                toast({ title: "Success", description: "Your password has been updated." });
                passwordForm.reset();
            } catch (error: any) {
                toast({ variant: 'destructive', title: "Error", description: error.message });
            }
        };
        setReauthAction(() => action); // Use function form
    };

    const handleReauthentication = async (values: z.infer<typeof reauthSchema>) => {
        setIsLoading(true);
        try {
            const credential = await reauthenticateWithPassword(values.password);
            if (credential && reauthAction) {
                await reauthAction();
                setReauthAction(null); // Clear action and close dialog
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: "Authentication Failed", description: error.message });
        } finally {
            setIsLoading(false);
            reauthForm.reset();
        }
    };
    
    const getInitials = (name: string | null | undefined) => {
        if (!name) return "U";
        const nameParts = name.split(' ');
        if (nameParts.length > 1) return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
        return name.substring(0, 2).toUpperCase();
    }


    return (
        <div className="grid gap-8 md:grid-cols-2">
            {/* Profile Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your display name and profile picture.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={user?.photoURL ?? undefined} alt={user?.displayName ?? 'User'} />
                            <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-lg">{user?.displayName}</p>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                        </div>
                    </div>
                    <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-4">
                            <FormField name="displayName" control={profileForm.control} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Display Name</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField name="photoURL" control={profileForm.control} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Profile Picture URL</FormLabel>
                                    <FormControl><Input placeholder="https://example.com/image.png" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Save Changes
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <div className="space-y-8">
                {/* Email Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Change Email</CardTitle>
                        <CardDescription>Update the email address associated with your account.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...emailForm}>
                            <form onSubmit={emailForm.handleSubmit(initiateEmailChange)} className="space-y-4">
                                <FormField name="newEmail" control={emailForm.control} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Email Address</FormLabel>
                                        <FormControl><Input type="email" placeholder="new.email@example.com" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <Button type="submit">Update Email</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Password Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>Set a new password for your account.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...passwordForm}>
                            <form onSubmit={passwordForm.handleSubmit(initiatePasswordChange)} className="space-y-4">
                                 <FormField name="newPassword" control={passwordForm.control} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl><Input type="password" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField name="confirmPassword" control={passwordForm.control} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm New Password</FormLabel>
                                        <FormControl><Input type="password" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <Button type="submit">Update Password</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
            
            {/* Reauthentication Dialog */}
            <Dialog open={!!reauthAction} onOpenChange={(open) => !open && setReauthAction(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Verify Your Identity</DialogTitle>
                        <DialogDescription>
                            For your security, please enter your current password to continue.
                        </DialogDescription>
                    </DialogHeader>
                     <Form {...reauthForm}>
                        <form id="reauth-form" onSubmit={reauthForm.handleSubmit(handleReauthentication)} className="space-y-4">
                             <FormField name="password" control={reauthForm.control} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Password</FormLabel>
                                    <FormControl><Input type="password" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </form>
                    </Form>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" form="reauth-form" disabled={isLoading}>
                             {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
