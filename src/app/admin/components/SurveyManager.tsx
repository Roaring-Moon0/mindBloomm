
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function SurveyManager() {
  return (
    <div className="grid gap-8 lg:grid-cols-1">
      <Card>
        <CardHeader>
          <CardTitle>Manage Surveys</CardTitle>
          <CardDescription>Survey management is currently disabled.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-20 text-muted-foreground">
            <FileText className="mx-auto h-12 w-12" />
            <p className="mt-4 font-semibold">Survey Management Not Active</p>
            <p className="text-sm">Adding, editing, and viewing surveys is disabled.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
