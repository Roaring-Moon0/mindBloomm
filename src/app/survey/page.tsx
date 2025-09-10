
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useFirestoreDocument } from '@/hooks/use-firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';


interface SurveyConfig {
    url: string;
}

export default function SurveyPage() {
    
    // Later, this will be the real path to the config document in Firestore
    const { data: surveyConfig, loading, error } = useFirestoreDocument<SurveyConfig>('config/survey');
    
    // For now, let's use a placeholder if the data isn't loaded yet.
    // This will eventually be controlled from your admin dashboard.
    const surveyFormUrl = surveyConfig?.url || "https://docs.google.com/forms/d/e/1FAIpQLSc_i92h6A-tM-Jd5T-bYI_H2eXpPQaO9L-nO0U9gU_rEa_bFg/viewform?usp=sf_link";

    return (
        <FadeIn>
            <div className="container mx-auto py-12 px-4 md:px-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight font-headline">Mental Health Survey</h1>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                        Your feedback is invaluable. By participating in this anonymous survey, you help us understand the community's needs and improve MindBloom for everyone.
                    </p>
                </div>

                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle>Help Us Grow</CardTitle>
                        <CardDescription>The survey will take approximately 5-10 minutes to complete. All responses are completely anonymous.</CardDescription>
                    </CardHeader>
                    <CardContent>
                    {loading && (
                            <div className="flex flex-col items-center justify-center h-[600px]">
                                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                                <p className="text-muted-foreground">Loading survey...</p>
                            </div>
                    )}
                    {!loading && error && (
                        <div className="flex flex-col items-center justify-center h-[600px] text-center">
                                <p className="text-destructive font-semibold">Could not load the survey.</p>
                                <p className="text-muted-foreground text-sm">There might be an issue with our configuration. Please try again later.</p>
                            </div>
                    )}
                    {!loading && !error && (
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
