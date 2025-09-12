
import Link from 'next/link';
import Logo from '@/components/icons/Logo';
import { Separator } from '@/components/ui/separator';

const helplines = [
    { name: "KIRAN Mental Health Helpline", number: "1800-599-0019", hours: "24/7" },
    { name: "Aasra", number: "+91-9820466726", hours: "24/7" },
    { name: "Vandrevala Foundation", number: "1860-266-2345", hours: "24/7" },
    { name: "Samaritans Mumbai", number: "+91 84229 84528", hours: "3 PM - 9 PM" },
    { name: "iCall (TISS)", number: "9152987821", hours: "Mon-Sat, 10 AM - 8 PM" },
];

export function Footer() {
  return (
    <footer className="border-t bg-secondary/30">
      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Logo className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">MindBloom</span>
            </div>
            <p className="text-muted-foreground text-sm">
                Your digital sanctuary for mental wellness, providing accessible and stigma-free support.
            </p>
             <p className="text-xs text-muted-foreground pt-4">
                &copy; {new Date().getFullYear()} MindBloom. All rights reserved.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
              <li><Link href="/resources" className="hover:text-primary">Resources</Link></li>
              <li><Link href="/games" className="hover:text-primary">Games</Link></li>
              <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary">Terms of Service</Link></li>
              <li><Link href="/admin" className="hover:text-primary">Admin</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-destructive">Emergency Helplines (India)</h4>
            <div className="text-sm text-muted-foreground space-y-3">
              <p>If you are in a crisis or feel you are in danger, please contact a helpline immediately.</p>
              <ul className="space-y-2">
                {helplines.map(line => (
                  <li key={line.name} className="flex flex-col">
                    <span className="font-semibold text-foreground">{line.name}</span>
                    <span className="text-primary font-medium">{line.number} <span className="text-muted-foreground font-normal">({line.hours})</span></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
