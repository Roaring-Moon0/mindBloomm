
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useFirestoreCollection, useFirestoreDocument } from '@/hooks/use-firestore';
import { updateConfig, addAnnouncement, deleteAnnouncement, toggleFeature } from '@/services/config-service';
import { toast } from '@/hooks/use-toast';
import { Loader2, Megaphone, Trash2, Settings, ToggleRight } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const configFormSchema = z.object({
  title: z.string().min(3, 'Title is required.'),
  description: z.string().min(10, 'Description is required.'),
});

const announcementFormSchema = z.object({
  text: z.string().min(5, 'Announcement text is required.'),
});

export default function ConfigManager() {
  const { data: appConfig, loading: configLoading } = useFirestoreDocument('config/app');
  const { data: announcements, loading: announcementsLoading } = useFirestoreCollection('announcements');
  const { data: features, loading: featuresLoading } = useFirestoreDocument('config/features');

  const configForm = useForm<z.infer<typeof configFormSchema>>({
    resolver: zodResolver(configFormSchema),
    values: {
      title: (appConfig as any)?.title ?? '',
      description: (appConfig as any)?.description ?? ''
    }
  });

  const announcementForm = useForm<z.infer<typeof announcementFormSchema>>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: { text: '' },
  });

  const onSaveConfig = async (values: z.infer<typeof configFormSchema>) => {
    try {
      await updateConfig({ title: values.title, description: values.description });
      toast({ title: 'Success!', description: 'App config has been updated.' });
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save the config.' });
    }
  };

  const onAddAnnouncement = async (values: z.infer<typeof announcementFormSchema>) => {
    try {
      await addAnnouncement({ text: values.text });
      toast({ title: 'Success!', description: 'Announcement has been added.' });
      announcementForm.reset();
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not add the announcement.' });
    }
  };

  const onDeleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await deleteAnnouncement(id);
      toast({ title: 'Success!', description: 'Announcement has been removed.' });
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete the announcement.' });
    }
  };

  const onToggleFeature = async (key: string, value: boolean) => {
    try {
      await toggleFeature(key, !value);
      toast({ title: 'Success!', description: `${key} feature has been ${!value ? 'enabled' : 'disabled'}.` });
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not toggle the feature.' });
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>App Config</CardTitle>
          <CardDescription>Change the app's main title and description (used for SEO and display).</CardDescription>
        </CardHeader>
        <CardContent>
          {configLoading ? (
            <div className="py-10 flex items-center justify-center text-muted-foreground gap-2"><Loader2 className="animate-spin h-5 w-5"/>Loading config...</div>
          ) : (
            <Form {...configForm}>
                <form onSubmit={configForm.handleSubmit(onSaveConfig)} className="space-y-4">
                <FormField name="title" control={configForm.control} render={({ field }) => (
                    <FormItem>
                    <FormLabel>App Title</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )} />

                <FormField name="description" control={configForm.control} render={({ field }) => (
                    <FormItem>
                    <FormLabel>App Description</FormLabel>
                    <FormControl><Textarea {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )} />

                <Button type="submit" disabled={configForm.formState.isSubmitting}>
                    {configForm.formState.isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...</> : 'Save Config'}
                </Button>
                </form>
            </Form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feature Toggles</CardTitle>
          <CardDescription>Enable or disable major features across the app.</CardDescription>
        </CardHeader>
        <CardContent>
           {featuresLoading ? (
                <div className="py-10 flex items-center justify-center text-muted-foreground gap-2"><Loader2 className="animate-spin h-5 w-5"/>Loading features...</div>
            ) : (features && Object.keys(features).length > 2) ? (
                <div className="space-y-4">
                {Object.entries(features as any).filter(([k]) => k !== 'id' && k !== 'createdAt').map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <Switch checked={!!value} onCheckedChange={() => onToggleFeature(key, !!value)} />
                </div>
                ))}
                </div>
            ) : (
                <div className="text-center py-10 text-muted-foreground">
                    <ToggleRight className="mx-auto h-12 w-12"/>
                    <p className="mt-4">No feature toggles configured.</p>
                </div>
            )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
          <CardDescription>Add or remove site-wide announcement banners.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...announcementForm}>
                <form onSubmit={announcementForm.handleSubmit(onAddAnnouncement)} className="flex items-start gap-4 mb-6">
                    <FormField control={announcementForm.control} name="text" render={({ field }) => (
                        <FormItem className="flex-grow">
                        <FormLabel className="sr-only">New Announcement</FormLabel>
                        <FormControl><Input placeholder="Enter announcement text..." {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                    <Button type="submit" disabled={announcementForm.formState.isSubmitting}>
                       {announcementForm.formState.isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Adding...</> : 'Add'}
                    </Button>
                </form>
          </Form>

          <div className="space-y-3">
            {announcementsLoading ? (
                 <div className="py-10 flex items-center justify-center text-muted-foreground gap-2"><Loader2 className="animate-spin h-5 w-5"/>Loading announcements...</div>
            ) : announcements && announcements.length > 0 ? (
              (announcements as any[]).map((a: any) => (
                <div key={a.id} className="flex items-center justify-between p-3 border rounded-lg bg-secondary/50">
                  <p className="text-sm font-medium">{a.text}</p>
                  <Button variant="ghost" size="icon" onClick={() => onDeleteAnnouncement(a.id)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                  <Megaphone className="mx-auto h-12 w-12"/>
                  <p className="mt-4">No active announcements.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
