
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useFirestoreCollection } from '@/hooks/use-firestore';
import { Loader2, AlertTriangle, FileText } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';
import type { SurveyConfig } from '@/app/admin/page';

const defaultSurvey = {
    id: 'default-google-form-survey',
    name: 'Student Mental Health & Well-being Survey',
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSccIKUZAvYOKoOssL3VpYJxwBP_uayhjxmF1BboqbPve6yIkw/viewform?pli=1',
    description: 'Your feedback will help us understand the key challenges students face. This survey is anonymous and takes about 5-10 minutes.'
}

export default function SurveyPage() {
    const { data: surveys, loading, error } = useFirestoreCollection<SurveyConfig>('surveys');

    return (
        <FadeIn>
            <div className="container mx-auto py-12 px-4 md:px-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight font-headline">Community Surveys</h1>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                        Your feedback is invaluable. By participating in these anonymous surveys, you help us understand the community's needs and improve MindBloom for everyone.
                    </p>
                </div>

                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle>Available Surveys</CardTitle>
                        <CardDescription>All responses are completely anonymous. Select a survey below to participate.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Always display the hardcoded default survey */}
                            <Link href={defaultSurvey.url} target="_blank" rel="noopener noreferrer" key={defaultSurvey.id} className="block">
                                <Card className="hover:bg-accent hover:border-primary/50 transition-colors border-2 border-primary/30">
                                    <CardHeader>
                                        <CardTitle className="text-lg">{defaultSurvey.name}</CardTitle>
                                        <CardDescription>{defaultSurvey.description}</CardDescription>
                                    </CardHeader>
                                </Card>
                            </Link>

                            {/* Display surveys from Firestore */}
                            {surveys && surveys.map(survey => (
                                <Link href={survey.url} target="_blank" rel="noopener noreferrer" key={survey.id} className="block">
                                    <Card className="hover:bg-accent hover:border-primary/50 transition-colors">
                                        <CardHeader>
                                            <CardTitle className="text-lg">{survey.name}</CardTitle>
                                            <CardDescription>Click to open the survey in a new tab.</CardDescription>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            ))}
                        </div>

                        {loading && (
                            <div className="flex flex-col items-center justify-center h-40 gap-4 mt-6">
                                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                                <p className="text-muted-foreground font-medium">Loading additional surveys...</p>
                            </div>
                        )}
                        
                        {error && (
                            <div className="flex flex-col items-center justify-center h-40 text-center gap-4 mt-6 bg-destructive/10 rounded-lg p-4">
                                <AlertTriangle className="w-10 h-10 text-destructive"/>
                                <p className="text-destructive font-semibold">Could not load additional surveys.</p>
                                <p className="text-muted-foreground text-sm max-w-sm">
                                    There was an error connecting to the database. The default survey above is still available.
                                </p>
                            </div>
                        )}

                        {!loading && !error && (!surveys || surveys.length === 0) && (
                            <p className="text-center text-sm text-muted-foreground pt-6">You can add more surveys from the admin dashboard.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </FadeIn>
    )
}
