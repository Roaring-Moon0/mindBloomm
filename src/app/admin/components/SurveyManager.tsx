'use client';

import { useState } from 'react';
import { useFirestoreCollection } from '@/hooks/use-firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, Trash2, Edit, AlertTriangle, FileText } from 'lucide-react';
import { SurveyForm } from './SurveyForm';
import { deleteSurvey, toggleSurveyVisibility } from '@/services/config-service';
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

interface Survey {
  id: string;
  name: string;
  url: string;
  description?: string;
  visible?: boolean;
}

export default function SurveyManager() {
  const { data: surveys, loading, error } = useFirestoreCollection<Survey>('surveys');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);

  const handleAdd = () => {
    setSelectedSurvey(null);
    setIsFormOpen(true);
  }

  const handleEdit = (survey: Survey) => {
    setSelectedSurvey(survey);
    setIsFormOpen(true);
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteSurvey(id);
      toast({ title: "Success", description: "Survey deleted successfully." });
    } catch (err: any) {
      toast({ variant: 'destructive', title: "Error", description: err.message });
    }
  }

  const handleToggleVisibility = async (id: string, currentVisibility: boolean) => {
    try {
      await toggleSurveyVisibility(id, !currentVisibility);
      toast({ title: "Success", description: `Survey visibility has been updated.` });
    } catch (err: any) {
      toast({ variant: 'destructive', title: "Error", description: err.message });
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <CardTitle>Manage Surveys</CardTitle>
          <CardDescription>Add, edit, or remove surveys from the app.</CardDescription>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <PlusCircle /> Add Survey
        </Button>
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
              There was an error connecting to the database. Please check your Firestore rules and ensure you are authenticated as an admin.
            </p>
          </div>
        ) : !surveys || surveys.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <FileText className="mx-auto h-12 w-12"/>
            <p className="mt-4 font-semibold">No surveys found.</p>
            <p className="text-sm">Click "Add Survey" to get started.</p>
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
                {surveys.map((survey) => (
                    <TableRow key={survey.id}>
                    <TableCell className="font-medium">{survey.name}</TableCell>
                    <TableCell className="truncate max-w-[200px]">
                        <a href={survey.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                        {survey.url}
                        </a>
                    </TableCell>
                    <TableCell className="text-center">
                        <Switch
                        checked={survey.visible !== false}
                        onCheckedChange={() => handleToggleVisibility(survey.id, survey.visible !== false)}
                        aria-label="Toggle survey visibility"
                        />
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(survey)}>
                        <Edit className="w-4 h-4"/>
                        </Button>
                        <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4"/>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the survey.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(survey.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
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
