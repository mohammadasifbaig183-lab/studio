import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">
              SynergySphere
            </span>
          </div>
          <nav className="flex gap-4 mb-4 md:mb-0 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground">About</Link>
            <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground">Terms of Service</Link>
          </nav>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SynergySphere. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
