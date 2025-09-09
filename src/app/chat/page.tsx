import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, ShieldAlert } from "lucide-react";
import { ChatUI } from './chat-ui';

export default function ChatPage() {
    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
             <div className="text-center mb-8">
                <h1 className="text-4xl font-bold tracking-tight font-headline">AI Assistant</h1>
                <p className="mt-4 text-lg text-muted-foreground">Get personalized suggestions based on your current state.</p>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="h-full">
                       <CardContent className="h-[70vh] flex flex-col p-0">
                           <ChatUI />
                       </CardContent>
                    </Card>
                </div>
                <div className="space-y-8">
                    <Card className="bg-destructive/20 border-destructive/50">
                        <CardHeader className="flex flex-row items-center gap-2">
                            <ShieldAlert className="w-6 h-6 text-destructive" />
                            <CardTitle>Important Disclaimer</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-destructive-foreground/90">
                            <p>This AI assistant is for informational and educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.</p>
                            <p className="mt-2">If you are in a crisis, please seek help immediately.</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center gap-2">
                            <Phone className="w-6 h-6 text-primary" />
                            <CardTitle>Indian Emergency Resources</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p><span className="font-semibold">KIRAN Mental Health Helpline:</span> Call 1800-599-0019</p>
                            <p><span className="font-semibold">Vandrevala Foundation:</span> Call 1860-266-2345</p>
                            <p><span className="font-semibold">iCall (TISS):</span> Call 9152987821</p>
                            <p><span className="font-semibold">National Emergency Number:</span> Call 112</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
