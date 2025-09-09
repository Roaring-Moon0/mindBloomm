// This is a placeholder for a user dashboard page.
// We will build this out in a future step.

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight font-headline">Dashboard</h1>
                <p className="mt-4 text-lg text-muted-foreground">Your personal space.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Coming Soon</CardTitle>
                    <CardDescription>This is where your personalized content and progress will appear.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Check back later!</p>
                </CardContent>
            </Card>
        </div>
    );
}
