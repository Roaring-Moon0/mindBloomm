
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FadeIn } from '@/components/ui/fade-in';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useAuth } from '@/hooks/use-auth';
import { useAdminAuth } from '@/hooks/use-admin-auth';

import { useFirestoreCollection } from '@/hooks/use-firestore';
import { PlusCircle, Trash2, Edit, AlertTriangle, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addSurvey, updateSurvey, deleteSurvey, toggleSurveyVisibility } from '@/services/config-service';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';


// --- Components are now in this file --- //

interface Survey {
  id: string;
  name: string;
  url: string;
  description?: string;
  visible?: boolean;
}

const surveyFormSchema = z.object({
  name: z.string().min(3),
  url: z.string().url(),
});


function SurveyForm({ isOpen, onOpenChange, survey }: { isOpen: boolean; onOpenChange: (isOpen: boolean) => void; survey: Survey | null; }){
  const form = useForm<z.infer<typeof surveyFormSchema>>({ resolver: zodResolver(surveyFormSchema), defaultValues: { name: '', url: '' } });
  const { formState: { isSubmitting } } = form;

  useEffect(() => { 
    if (isOpen) {
      form.reset(survey ? { name: survey.name, url: survey.url } : { name: '', url: '' }); 
    }
  }, [survey, isOpen, form]);

  const onSubmit = async (values: z.infer<typeof surveyFormSchema>) => {
    try {
      if (survey) {
        await updateSurvey(survey.id, values);
        toast({ title: "Success", description: "Survey updated" });
      } else {
        await addSurvey(values);
        toast({ title: "Success", description: "Survey added" });
      }
      onOpenChange(false);
    } catch (err: any) { 
      toast({ variant: 'destructive', title: "Error", description: err.message }); 
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{survey ? "Edit Survey" : "Add New Survey"}</DialogTitle>
          <DialogDescription>Fill details and save.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField name="name" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Survey Name</FormLabel>
                <FormControl><Input {...field} placeholder="E.g., Student Wellness Check-in"/></FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
            <FormField name="url" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Survey URL</FormLabel>
                <FormControl><Input {...field} type="url" placeholder="https://forms.gle/..."/></FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
            <DialogFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Saving...</> : "Save"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


function SurveyManager() {
  const { data: surveys = [], loading, error } = useFirestoreCollection<Survey>('surveys');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);

  const handleAdd = () => { setSelectedSurvey(null); setIsFormOpen(true); }
  const handleEdit = (survey: Survey) => { setSelectedSurvey(survey); setIsFormOpen(true); }

  const handleDelete = async (id: string) => {
    try { await deleteSurvey(id); toast({ title: "Deleted", description: "Survey deleted successfully." }); }
    catch (err: any) { toast({ variant: 'destructive', title: "Error", description: err.message }); }
  }

  const handleToggleVisibility = async (id: string, current: boolean) => {
    try { await toggleSurveyVisibility(id, !current); toast({ title: "Updated", description: "Visibility updated." }); }
    catch (err: any) { toast({ variant: 'destructive', title: "Error", description: err.message }); }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <CardTitle>Manage Surveys</CardTitle>
          <CardDescription>Add, edit, or remove surveys.</CardDescription>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2"><PlusCircle /> Add Survey</Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-60 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium">Loading surveys...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-60 text-center gap-4 bg-destructive/10 rounded-lg p-4">
            <AlertTriangle className="w-10 h-10 text-destructive"/>
            <p className="text-destructive font-semibold">Could not load surveys.</p>
            <p className="text-muted-foreground text-sm max-w-sm">
              Check Firestore rules and authentication.
            </p>
          </div>
        ) : surveys.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <FileText className="mx-auto h-12 w-12"/>
            <p className="mt-4 font-semibold">No surveys found.</p>
            <p className="text-sm">Click "Add Survey" to start.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[600px] md:min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead className="text-center">Visible</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {surveys.map(s => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="truncate max-w-[200px]">
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">{s.url}</a>
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch checked={s.visible !== false} onCheckedChange={() => handleToggleVisibility(s.id, s.visible !== false)} aria-label="Toggle visibility"/>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(s)}><Edit className="w-4 h-4"/></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4"/></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(s.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <SurveyForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        survey={selectedSurvey}
      />
    </Card>
  );
}


function AdminDashboardContent() {
  const { user, logout } = useAdminAuth();

  return (
    <FadeIn>
      <div className="container mx-auto py-12 px-4 md:px-6 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight font-headline">Admin Dashboard</h1>
            <p className="mt-2 text-lg text-muted-foreground">Welcome, {user?.email}.</p>
          </div>
          <Button variant="outline" onClick={logout}>Log Out</Button>
        </div>

        <Tabs defaultValue="surveys" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full h-auto">
            <TabsTrigger value="surveys">Surveys</TabsTrigger>
            <TabsTrigger value="videos" disabled>Videos</TabsTrigger>
            <TabsTrigger value="users" disabled>Users</TabsTrigger>
            <TabsTrigger value="config" disabled>Config</TabsTrigger>
          </TabsList>

          <TabsContent value="surveys" className="mt-6">
            <SurveyManager />
          </TabsContent>
          <TabsContent value="videos" className="mt-6">Videos Section Disabled</TabsContent>
          <TabsContent value="users" className="mt-6">Users Section Disabled</TabsContent>
          <TabsContent value="config" className="mt-6">Config Section Disabled</TabsContent>
        </Tabs>
      </div>
    </FadeIn>
  );
}

export default function AdminPage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading, error, verifyCode, logout } = useAdminAuth();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  const loading = authLoading || adminLoading;

  useEffect(() => {
    if (!loading && !authUser) {
      router.push('/login?redirect=/admin');
    }
  }, [loading, authUser, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
        <h1 className="text-2xl font-bold">Verifying access...</h1>
        <p className="text-muted-foreground">Please wait a moment.</p>
      </div>
    );
  }

  if (!authUser) return null;

  if (!isAdmin) {
    return (
      <FadeIn>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <CardTitle>Admin Verification</CardTitle>
              <CardDescription>An admin code is required to access this dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="text"
                placeholder="Enter your admin code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
              <Button
                onClick={async () => {
                  setVerifying(true);
                  await verifyCode(code);
                  setVerifying(false);
                }}
                disabled={verifying || !code}
                className="w-full"
              >
                {verifying ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Verifying...</> : "Verify Code"}
              </Button>
              <Button variant="link" onClick={logout} className="w-full text-muted-foreground">Logout</Button>
            </CardContent>
          </Card>
        </div>
      </FadeIn>
    );
  }

  return <AdminDashboardContent />;
}
