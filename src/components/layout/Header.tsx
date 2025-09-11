
'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
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

const navLinks = [
  { href: '/resources', label: 'Resources' },
  { href: '/games', label: 'Games' },
  { href: '/chat', label: 'Bloom AI' },
  { href: '/survey', label: 'Survey' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

const adminLinks = [
    { href: '/admin/login', label: 'Admin Login' }
]

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
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden flex-1 md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">MindBloom</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                prefetch={true}
              >
                {link.label}
              </Link>
            ))}
            <Separator orientation="vertical" className="h-6" />
            {adminLinks.map((link) => (
                 <Link
                    key={link.href}
                    href={link.href}
                    className="transition-colors hover:text-foreground/80 text-foreground/60"
                    prefetch={true}
                >
                    {link.label}
                </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between md:justify-end md:gap-4">
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
                <div className="my-4 flex flex-col space-y-3 pl-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Separator className="my-2" />
                  {adminLinks.map((link) => (
                     <Link
                        key={link.href}
                        href={link.href}
                        className="text-foreground"
                    >
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
            <ThemeToggle />
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}
