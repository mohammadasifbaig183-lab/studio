import Hero from '@/components/landing/Hero';
import FeaturedEvents from '@/components/landing/FeaturedEvents';

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <FeaturedEvents />
      </div>
    </div>
  );
}
