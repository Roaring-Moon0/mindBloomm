
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { MobileNav } from './MobileNav';
import Logo from '@/components/icons/Logo';
import { AuthButton } from './AuthButton';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/resources', label: 'Resources' },
  { href: '/games', label: 'Games' },
  { href: '/chat', label: 'Bloom AI' },
  { href: '/survey', label: 'Survey' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

const adminLink = { href: '/admin', label: 'Admin' };

export function Header() {
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

        <MobileNav navLinks={navLinks} adminLink={adminLink} />
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex flex-1 items-center gap-1 text-sm">
          {navLinks.map((link) => (
            <Button key={link.href} variant="ghost" asChild>
              <Link
                href={link.href}
                className="transition-colors hover:text-foreground text-muted-foreground"
              >
                {link.label}
              </Link>
            </Button>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex flex-shrink-0 items-center justify-end gap-2">
            <div className="hidden lg:flex items-center gap-1">
                 <Button key={adminLink.href} variant="ghost" asChild>
                    <Link
                        href={adminLink.href}
                        className="transition-colors hover:text-foreground text-muted-foreground border-l ml-1 pl-3 rounded-none"
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
