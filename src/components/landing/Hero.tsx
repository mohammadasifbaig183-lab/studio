import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');
  
  return (
    <section className="relative h-[60vh] md:h-[70vh] w-full flex items-center justify-center text-white">
      {heroImage && (
         <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 text-center p-4">
        <div className="bg-black/30 backdrop-blur-md p-8 md:p-12 rounded-xl border border-white/20">
            <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4">
              The Future of Events is Here.
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-white mb-8">
              Discover, connect, and collaborate at the most innovative events powered by AI. Your next big idea starts at SynergySphere.
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/#events">Explore Events</Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
