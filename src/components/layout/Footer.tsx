import Link from 'next/link';
import Logo from '@/components/icons/Logo';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Logo className="h-6 w-6 text-muted-foreground" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built for your peace of mind. &copy; {new Date().getFullYear()} MindBloom.
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/about" className="hover:text-foreground" prefetch={true}>About</Link>
          <Link href="/contact" className="hover:text-foreground" prefetch={true}>Contact</Link>
          <Link href="/admin/login" className="hover:text-foreground" prefetch={true}>Admin Login</Link>
          <Link href="#" className="hover:text-foreground" prefetch={true}>Privacy Policy</Link>
          <Link href="#" className="hover:text-foreground" prefetch={true}>Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
