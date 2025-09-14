
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
  SheetClose
} from '@/components/ui/sheet';
import Logo from '@/components/icons/Logo';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { AuthButton } from './AuthButton';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/resources', label: 'Resources' },
  { href: '/journal', label: 'Journal' },
  { href: '/games', label: 'Games' },
  { href: '/chat', label: 'Bloom AI' },
  { href: '/survey', label: 'Survey' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

const adminLink = { href: '/admin', label: 'Admin' };

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Close the mobile menu on route change
    setOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        
        {/* Logo (Left on desktop) */}
        <div className="hidden lg:flex mr-6">
            <Link href="/" className="flex items-center space-x-2">
                <Logo className="h-6 w-6 text-primary" />
                <span className="hidden font-bold sm:inline-block">MindBloom</span>
            </Link>
        </div>

        {/* Hamburger Menu (Left on mobile/tablet) */}
        <div className="lg:hidden flex-1">
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
                <Link href="/" className="flex items-center space-x-2 mb-6">
                <Logo className="h-6 w-6 text-primary" />
                <span className="font-bold">MindBloom</span>
              </Link>
              <div className="flex flex-col space-y-2">
                {[...navLinks, adminLink].map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className={cn("font-medium text-lg p-2 rounded-md", pathname === link.href ? "bg-primary/10 text-primary" : "text-muted-foreground")}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo (Center on mobile/tablet) */}
        <div className="flex-1 flex justify-center lg:hidden">
            <Link href="/" className="flex items-center space-x-2">
                <Logo className="h-6 w-6 text-primary" />
                <span className="hidden font-bold sm:inline-block">MindBloom</span>
            </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex flex-1 items-center gap-1 text-sm">
          {navLinks.map((link) => (
            <Button key={link.href} variant="ghost" asChild className={cn("text-muted-foreground", pathname === link.href && "text-foreground font-semibold")}>
              <Link
                href={link.href}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            </Button>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex flex-shrink-0 items-center justify-end gap-2">
            <div className="hidden lg:flex items-center gap-1">
                 <Button key={adminLink.href} variant="ghost" asChild className={cn("text-muted-foreground border-l ml-1 pl-3 rounded-none", pathname === adminLink.href && "text-foreground font-semibold")}>
                    <Link
                        href={adminLink.href}
                        className="transition-colors hover:text-foreground"
                    >
                        {adminLink.label}
                    </Link>
                </Button>
            </div>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
