
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider } from '@/hooks/use-auth';
import { headers } from 'next/headers';


const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'MindBloom',
  description: 'Your sanctuary for mental wellness and personal growth.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = headers().get('next-url') || '';
  const isChatPage = pathname.startsWith('/chat');

  return (
    <html lang="en" style={{'--header-height': '64px'} as React.CSSProperties}>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239FD8FF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 2a5 5 0 0 0-5 5c0 1.38.56 2.63 1.46 3.54' /><path d='M12 22a5 5 0 0 0 5-5c0-1.38-.56-2.63-1.46-3.54' /><path d='M22 12a5 5 0 0 0-5-5c-1.38 0-2.63.56-3.54 1.46' /><path d='M2 12a5 5 0 0 0 5 5c1.38 0 2.63-.56 3.54-1.46' /></svg>" />
      </head>
      <body className={cn(
          'font-body antialiased', 
          inter.variable,
          isChatPage && 'is-chat-page'
        )}>
          <AuthProvider>
            <div className={cn(
              "relative flex min-h-screen flex-col bg-background",
              isChatPage && "h-screen overflow-hidden"
            )}>
              <Header />
              <main className="flex-1 flex flex-col pt-[var(--header-height)]">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </AuthProvider>
      </body>
    </html>
  );
}
