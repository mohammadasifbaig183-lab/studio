import type { Event } from '@/lib/types';
import EventCard from './EventCard';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'AI & The Future of Work',
    date: 'October 26, 2024',
    location: 'Virtual',
    description: 'Explore how artificial intelligence is reshaping industries and careers.',
    tags: ['AI', 'Technology', 'Future'],
    imageUrl: PlaceHolderImages.find(p => p.id === 'event-1')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'event-1')?.imageHint || '',
  },
  {
    id: '2',
    title: 'Global Hackathon 2024',
    date: 'November 1-3, 2024',
    location: 'San Francisco, CA',
    description: 'The world\'s largest hackathon. Build, learn, and compete for amazing prizes.',
    tags: ['Hackathon', 'Coding', 'Innovation'],
    imageUrl: PlaceHolderImages.find(p => p.id === 'event-2')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'event-2')?.imageHint || '',
  },
  {
    id: '3',
    title: 'Creative Design Summit',
    date: 'November 15, 2024',
    location: 'Virtual',
    description: 'A full day of talks and workshops from the leading minds in design.',
    tags: ['Design', 'UX/UI', 'Creative'],
    imageUrl: PlaceHolderImages.find(p => p.id === 'event-3')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'event-3')?.imageHint || '',
  },
    {
    id: '4',
    title: 'Web3 Forward Conference',
    date: 'December 5-6, 2024',
    location: 'Miami, FL',
    description: 'Deep dive into the decentralized future with blockchain experts and pioneers.',
    tags: ['Web3', 'Blockchain', 'Crypto'],
    imageUrl: PlaceHolderImages.find(p => p.id === 'event-4')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'event-4')?.imageHint || '',
  },
];

export default function FeaturedEvents() {
  return (
    <section id="events" className="py-12 md:py-20">
      <div className="text-center mb-10">
        <h2 className="font-headline text-3xl md:text-4xl font-bold">Featured Events</h2>
        <p className="text-muted-foreground mt-2">Join thousands of innovators at our upcoming events.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MOCK_EVENTS.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
