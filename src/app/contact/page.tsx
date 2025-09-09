"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, Clock } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

const faqs = [
    {
        question: "Is MindBloom a substitute for therapy?",
        answer: "No, MindBloom is designed to be a supportive tool but is not a substitute for professional therapy or medical advice. We provide resources and tools to help you manage your mental well-being. If you are in crisis, please contact a medical professional or an emergency hotline."
    },
    {
        question: "How is my data protected?",
        answer: "We take your privacy very seriously. All personal data is encrypted and stored securely. We do not share your personal information with third parties without your explicit consent. Please see our Privacy Policy for more details."
    },
    {
        question: "How does the AI assistant work?",
        answer: "Our AI assistant uses a large language model to understand your inputs and provide supportive responses and personalized recommendations from our resource library. It is not a real person and its advice should be considered informational, not medical."
    },
    {
        question: "Can I use MindBloom for free?",
        answer: "Yes, many of our core features, including the resource library and AI assistant, are available for free. We may offer premium features in the future to help sustain and grow the platform."
    }
]

export default function ContactPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Simulate API call
    console.log("Form submitted:", values);
    
    // In a real application, you would send this data to a server or Firebase function.
    // Example:
    // try {
    //   const response = await fetch('/api/contact', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(values),
    //   });
    //   if (!response.ok) throw new Error('Something went wrong');
    //   toast({ title: "Message Sent!", description: "Thank you for reaching out. We'll get back to you soon." });
    //   form.reset();
    // } catch (error) {
    //   toast({ variant: "destructive", title: "Uh oh!", description: "Could not send message. Please try again." });
    // }

    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. We'll get back to you soon.",
    });
    form.reset();
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight font-headline">Get In Touch</h1>
        <p className="mt-4 text-lg text-muted-foreground">We're here to help. Send us a message or check out our FAQs.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>We'll do our best to respond within 24-48 hours.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl><Input placeholder="Your Name" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input type="email" placeholder="your.email@example.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="subject" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl><Input placeholder="How can we help?" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="message" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl><Textarea placeholder="Your message..." className="min-h-[120px]" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2 space-y-8">
            <Card className="bg-secondary/50">
                <CardHeader>
                    <CardTitle>Other Ways to Reach Us</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <a href="mailto:hello@mindbloom.app" className="hover:text-primary">hello@mindbloom.app</a>
                    </div>
                     <div className="flex items-center gap-4">
                        <Phone className="w-5 h-5 text-muted-foreground" />
                        <span>(555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        <span>Mon-Fri, 9am - 5pm EST</span>
                    </div>
                </CardContent>
            </Card>

            <div>
                <h3 className="text-2xl font-bold mb-4 font-headline">Frequently Asked Questions</h3>
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
      </div>
    </div>
  );
}
