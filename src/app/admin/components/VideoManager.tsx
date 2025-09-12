
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, Trash2, Edit3, Youtube } from 'lucide-react';
import { useFirestoreCollection } from '@/hooks/use-firestore';
import { addVideo, deleteVideo, updateVideo, toggleVideoVisibility } from '@/services/config-service';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';

const addVideoSchema = z.object({ 
    name: z.string().min(3, { message: 'Video name must be at least 3 characters.'}), 
    url: z.string().url({ message: 'Please enter a valid YouTube URL.'}).refine(val => val.includes('youtube.com') || val.includes('youtu.be'), { message: 'URL must be a valid YouTube link.'})
});

export default function VideoManager() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: videos, loading } = useFirestoreCollection('videos');

  const form = useForm<z.infer<typeof addVideoSchema>>({
    resolver: zodResolver(addVideoSchema),
    defaultValues: { name: '', url: '' },
  });

  async function onAdd(values: z.infer<typeof addVideoSchema>) {
    setIsSubmitting(true);
    try {
      await addVideo(values);
      toast({ title: 'Success!', description: 'Video has been added.' });
      form.reset();
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not add the video.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  const onDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    try {
      await deleteVideo(id);
      toast({ title: 'Success!', description: 'Video has been removed.' });
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete the video.' });
    }
  };

  const onToggle = async (id: string, visible: boolean) => {
    try {
      await toggleVideoVisibility(id, !visible);
      toast({ title: 'Success!', description: 'Video visibility has been updated.' });
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update visibility.' });
    }
  };

  const onEdit = async (id: string) => {
    const v = videos?.find((x: any) => x.id === id);
    if (!v) return;
    const newName = prompt('Enter new video name', v.name);
    if (newName === null) return;
    const newUrl = prompt('Enter new video URL', v.url);
    if (newUrl === null) return;
    
    try {
      await updateVideo(id, { name: newName || v.name, url: newUrl || v.url });
      toast({ title: 'Success!', description: 'Video has been updated.' });
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update the video.' });
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Add New Video</CardTitle>
          <CardDescription>Add a new YouTube video link to the app's resource library.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onAdd)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Name</FormLabel>
                  <FormControl><Input placeholder="e.g., 'Guided Meditation for Stress'" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="url" render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube URL</FormLabel>
                  <FormControl><Input placeholder="https://www.youtube.com/watch?v=..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Adding...</> : <><PlusCircle className="mr-2 h-4 w-4"/> Add Video</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Videos</CardTitle>
          <CardDescription>View, edit, or remove existing videos.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground gap-2"><Loader2 className="animate-spin h-5 w-5"/>Loading videos...</div>
          ) : (videos && videos.length > 0) ? (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Visible</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {videos.map((v: any) => (
                    <TableRow key={v.id}>
                        <TableCell className="font-medium">
                            <Link href={v.url} target="_blank" rel="noreferrer" className="hover:underline">{v.name}</Link>
                        </TableCell>
                        <TableCell>
                            <Switch checked={v.visible ?? true} onCheckedChange={() => onToggle(v.id, v.visible ?? true)} />
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => onEdit(v.id)}><Edit3 className="h-4 w-4"/></Button>
                            <Button variant="ghost" size="icon" onClick={() => onDelete(v.id)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
                <Youtube className="mx-auto h-12 w-12"/>
                <p className="mt-4">No videos found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
