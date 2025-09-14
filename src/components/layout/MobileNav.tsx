
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
import { cn } from '@/lib/utils';

interface NavLink {
    href: string;
    label: string;
}

interface MobileNavProps {
    navLinks: NavLink[];
    adminLink: NavLink;
}

export function MobileNav({ navLinks, adminLink }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
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
                    className={cn(
                      "font-medium text-lg p-2 rounded-md",
                      pathname === link.href ? "bg-primary/10 text-primary" : "text-muted-foreground"
                    )}
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
    </>
  );
}
