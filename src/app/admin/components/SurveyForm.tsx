'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addSurvey, updateSurvey } from '@/services/config-service';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface Survey {
  id: string;
  name: string;
  url: string;
  description?: string;
  visible?: boolean;
}

interface SurveyFormProps { 
  isOpen: boolean; 
  onOpenChange: (isOpen: boolean) => void; 
  survey: Survey | null; 
}

const surveyFormSchema = z.object({
  name: z.string().min(3, { message: "Survey name must be at least 3 characters."}),
  url: z.string().url({ message: "Please enter a valid URL."}),
});

export function SurveyForm({ isOpen, onOpenChange, survey }: SurveyFormProps) {
  const form = useForm<z.infer<typeof surveyFormSchema>>({ 
    resolver: zodResolver(surveyFormSchema), 
    defaultValues: { name: '', url: '' }
  });
  
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
        toast({ title: "Success", description: "Survey updated successfully." });
      } else {
        await addSurvey(values);
        toast({ title: "Success", description: "Survey added successfully." });
      }
      onOpenChange(false);
    } catch (err: any) { 
      toast({ variant: 'destructive', title: "Error saving survey", description: err.message }); 
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{survey ? "Edit Survey" : "Add New Survey"}</DialogTitle>
          <DialogDescription>Fill in the details below and click save.</DialogDescription>
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
