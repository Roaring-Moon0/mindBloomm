
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Later, this URL will be managed from the admin dashboard
const SURVEY_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSc_i92h6A-tM-Jd5T-bYI_H2eXpPQaO9L-nO0U9gU_rEa_bFg/viewform?usp=sf_link";

export default function SurveyPage() {
    return (
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
                    <div className="aspect-w-16 aspect-h-9">
                        <iframe
                            src={SURVEY_FORM_URL}
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
                            <Link href={SURVEY_FORM_URL} target="_blank" rel="noopener noreferrer">
                                Open Survey in New Tab
                            </Link>
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">If you have trouble viewing the embedded form, please open it in a new tab.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
