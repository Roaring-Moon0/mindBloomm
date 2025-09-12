
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, Trash2, Edit3, Eye, EyeOff } from 'lucide-react';
import { useFirestoreCollection } from '@/hooks/use-firestore';
import { addSurvey, deleteSurvey, updateSurvey, toggleSurveyVisibility } from '@/services/config-service';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const addSurveyFormSchema = z.object({
  name: z.string().min(3, { message: 'Survey name must be at least 3 characters.'}),
  url: z.string().url({ message: 'Please enter a valid URL.'}),
});

export default function SurveyManager() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: surveys, loading } = useFirestoreCollection('surveys');

  const form = useForm<z.infer<typeof addSurveyFormSchema>>({
    resolver: zodResolver(addSurveyFormSchema),
    defaultValues: { name: '', url: '' },
  });

  async function onAdd(values: z.infer<typeof addSurveyFormSchema>) {
    setIsSubmitting(true);
    try {
      await addSurvey(values);
      toast({ title: 'Success!', description: 'Survey has been added.' });
      form.reset();
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not add the survey.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  const onDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this survey?')) return;
    try {
      await deleteSurvey(id);
      toast({ title: 'Success!', description: 'Survey has been removed.' });
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete the survey.' });
    }
  };

  const onToggle = async (id: string, visible: boolean) => {
    try {
      await toggleSurveyVisibility(id, !visible);
      toast({ title: 'Success!', description: 'Survey visibility has been updated.' });
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update visibility.' });
    }
  };

  const onEdit = async (id: string) => {
    const s = surveys?.find((x: any) => x.id === id);
    if (!s) return;
    const newName = prompt('Enter new survey name', s.name);
    if (newName === null) return;
    const newUrl = prompt('Enter new survey URL', s.url);
    if (newUrl === null) return;
    
    try {
      await updateSurvey(id, { name: newName || s.name, url: newUrl || s.url });
      toast({ title: 'Success!', description: 'Survey has been updated.' });
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update the survey.' });
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Add New Survey</CardTitle>
          <CardDescription>Add a new survey link to be displayed on the /survey page.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onAdd)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Survey Name</FormLabel>
                  <FormControl><Input placeholder="e.g., 'Campus Mental Health Check'" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="url" render={({ field }) => (
                <FormItem>
                  <FormLabel>Survey URL</FormLabel>
                  <FormControl><Input placeholder="https://docs.google.com/forms/..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Adding...</> : <><PlusCircle className="mr-2 h-4 w-4"/> Add Survey</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Surveys</CardTitle>
          <CardDescription>View, edit, or remove existing surveys.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground gap-2"><Loader2 className="animate-spin h-5 w-5"/>Loading surveys...</div>
          ) : (surveys && surveys.length > 0) ? (
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Visible</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {surveys.map((s: any) => (
                    <TableRow key={s.id}>
                        <TableCell className="font-medium">
                           <Link href={s.url} target="_blank" rel="noreferrer" className="hover:underline">{s.name}</Link>
                        </TableCell>
                        <TableCell>
                           <Switch checked={s.visible ?? true} onCheckedChange={() => onToggle(s.id, s.visible ?? true)} />
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => onEdit(s.id)}><Edit3 className="h-4 w-4"/></Button>
                            <Button variant="ghost" size="icon" onClick={() => onDelete(s.id)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 text-muted-foreground">No surveys found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
