
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useFirestoreDocument } from '@/hooks/use-firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, AlertTriangle } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';


interface SurveyConfig {
    url: string;
}

export default function SurveyPage() {
    
    const { data: surveyConfig, loading, error } = useFirestoreDocument<SurveyConfig>('config/survey');
    
    // The survey URL is now dynamically fetched from Firestore.
    const surveyFormUrl = surveyConfig?.url;

    return (
        <FadeIn>
            <div className="container mx-auto py-12 px-4 md:px-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight font-headline">Mental Health Survey</h1>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                        Your feedback is invaluable. By participating in this anonymous survey, you help us understand the community's needs and improve MindBloom for everyone.
                    </p>
                </div>

                <Card className="max-w-4xl mx-auto min-h-[700px]">
                    <CardHeader>
                        <CardTitle>Help Us Grow</CardTitle>
                        <CardDescription>The survey will take approximately 5-10 minutes to complete. All responses are completely anonymous.</CardDescription>
                    </CardHeader>
                    <CardContent>
                    {loading && (
                            <div className="flex flex-col items-center justify-center h-[600px] gap-4">
                                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                                <p className="text-muted-foreground font-medium">Loading survey...</p>
                            </div>
                    )}
                    
                    {!loading && (error || !surveyFormUrl) && (
                        <div className="flex flex-col items-center justify-center h-[600px] text-center gap-4 bg-secondary/50 rounded-lg">
                                <AlertTriangle className="w-12 h-12 text-destructive"/>
                                <p className="text-destructive font-semibold text-lg">Could not load the survey.</p>
                                <p className="text-muted-foreground text-sm max-w-sm">
                                    {error ? "There was an error connecting to our database." : "No survey URL has been configured by an administrator."}
                                    <br />
                                    Please try again later or contact support.
                                </p>
                            </div>
                    )}

                    {!loading && !error && surveyFormUrl && (
                        <>
                            <div className="aspect-w-16 aspect-h-9">
                                <iframe
                                    src={surveyFormUrl}
                                    width="100%"
                                    height="600"
                                    frameBorder="0"
                                    marginHeight={0}
                                    marginWidth={0}
                                    className="rounded-md"
                                >
                                    Loading…
                                </iframe>
                            </div>
                            <div className="text-center mt-6">
                                <Button asChild>
                                    <Link href={surveyFormUrl} target="_blank" rel="noopener noreferrer">
                                        Open Survey in New Tab
                                    </Link>
                                </Button>
                                <p className="text-xs text-muted-foreground mt-2">If you have trouble viewing the embedded form, please open it in a new tab.</p>
                            </div>
                        </>
                    )}
                    </CardContent>
                </Card>
            </div>
        </FadeIn>
    )
}
