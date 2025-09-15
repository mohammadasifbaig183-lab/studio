import Hero from '@/components/landing/Hero';
import FeaturedEvents from '@/components/landing/FeaturedEvents';
import Sponsors from '@/components/landing/Sponsors';

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <FeaturedEvents />
        <Sponsors />
      </div>
    </div>
  );
}
