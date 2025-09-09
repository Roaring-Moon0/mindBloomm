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
                    <Card className="bg-destructive/10 border-destructive">
                        <CardHeader className="flex flex-row items-center gap-2">
                            <ShieldAlert className="w-6 h-6 text-destructive" />
                            <CardTitle>Important Disclaimer</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-destructive-foreground/80">
                            <p>This AI assistant is for informational and educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.</p>
                            <p className="mt-2">If you are in a crisis, please seek help immediately.</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center gap-2">
                            <Phone className="w-6 h-6 text-primary" />
                            <CardTitle>Emergency Resources</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p><span className="font-semibold">Crisis Text Line:</span> Text HOME to 741741</p>
                            <p><span className="font-semibold">National Suicide Prevention Lifeline:</span> Call or text 988</p>
                            <p><span className="font-semibold">Emergency Services:</span> Call 911</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
