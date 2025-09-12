
'use client';

import Link from 'next/link';
import { Menu, Home, Library, Gamepad2, MessageSquare, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import Logo from '@/components/icons/Logo';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ThemeToggle } from '@/components/theme-toggle';
import { AuthButton } from './AuthButton';
import { Separator } from '../ui/separator';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
  { href: '/resources', label: 'Library', icon: <Library className="w-4 h-4" /> },
  { href: '/games', label: 'Games', icon: <Gamepad2 className="w-4 h-4" /> },
  { href: '/chat', label: 'Chat', icon: <MessageSquare className="w-4 h-4" /> },
  { href: '/dashboard', label: 'Profile', icon: <User className="w-4 h-4" /> },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      setOpen(false);
    }
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 hidden flex-1 md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">MindBloom</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between md:justify-end md:gap-4">
            <nav className="hidden md:flex items-center gap-1 text-sm">
                {navLinks.map((link) => (
                <Button key={link.href} variant="ghost" asChild className={cn("text-muted-foreground", pathname === link.href && "text-foreground bg-accent/50")}>
                    <Link
                        href={link.href}
                        className="transition-colors hover:text-foreground"
                        prefetch={true}
                    >
                        {link.icon}
                        {link.label}
                    </Link>
                </Button>
                ))}
            </nav>

          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <VisuallyHidden>
                  <SheetTitle>Mobile Navigation Menu</SheetTitle>
                  <SheetDescription>
                    A list of links to navigate the MindBloom website.
                  </SheetDescription>
                </VisuallyHidden>
                <Link href="/" className="flex items-center space-x-2">
                  <Logo className="h-6 w-6 text-primary" />
                  <span className="font-bold">MindBloom</span>
                </Link>
                <div className="my-4 flex flex-col space-y-2 pl-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-foreground flex items-center gap-2"
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <Link href="/" className="flex items-center space-x-2 md:hidden">
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-bold">MindBloom</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Separator orientation="vertical" className="h-6 hidden md:block" />
            <ThemeToggle />
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}
