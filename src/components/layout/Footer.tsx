'use client';
import Link from 'next/link';
import { Sparkles, Users } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    // Generate initial count only on the client-side to avoid hydration mismatch
    const initialCount = Math.floor(Math.random() * 1000) + 500;
    setVisitorCount(initialCount);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setVisitorCount(prevCount => prevCount + Math.floor(Math.random() * 3) + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">
              SynergySphere
            </span>
          </div>
          <nav className="flex gap-4 justify-center text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground">About</Link>
            <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground">Terms of Service</Link>
          </nav>
          <div className="flex flex-col items-center md:items-end gap-2">
             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                {visitorCount > 0 ? (
                  <span>{visitorCount.toLocaleString()} visitors online</span>
                ) : (
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                )}
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SynergySphere. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
