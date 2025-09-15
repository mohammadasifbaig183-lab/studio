import type { Event } from '@/lib/types';
import EventCard from './EventCard';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'AI & The Future of Work',
    date: 'October 26, 2024',
    location: 'Virtual',
    description: 'Explore how artificial intelligence is reshaping industries and careers in this groundbreaking virtual summit. Join leaders from around the world.',
    tags: ['AI', 'Technology', 'Future'],
    imageUrl: PlaceHolderImages.find(p => p.id === 'event-1')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'event-1')?.imageHint || '',
  },
  {
    id: '2',
    title: 'Global Hackathon 2024',
    date: 'November 1-3, 2024',
    location: 'San Francisco, CA',
    description: 'The world\'s largest hackathon returns. Build, learn, and compete with the brightest minds for amazing prizes. Innovation starts here.',
    tags: ['Hackathon', 'Coding', 'Innovation'],
    imageUrl: PlaceHolderImages.find(p => p.id === 'event-2')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'event-2')?.imageHint || '',
  },
  {
    id: '3',
    title: 'Creative Design Summit',
    date: 'November 15, 2024',
    location: 'Virtual',
    description: 'A full day of inspiring talks and hands-on workshops from the leading minds in the design industry. Perfect for UX/UI and graphic designers.',
    tags: ['Design', 'UX/UI', 'Creative'],
    imageUrl: PlaceHolderImages.find(p => p.id === 'event-3')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'event-3')?.imageHint || '',
  },
    {
    id: '4',
    title: 'Web3 Forward Conference',
    date: 'December 5-6, 2024',
    location: 'Miami, FL',
    description: 'A two-day deep dive into the decentralized future. Connect with blockchain experts, developers, and pioneers shaping the next wave of the internet.',
    tags: ['Web3', 'Blockchain', 'Crypto'],
    imageUrl: PlaceHolderImages.find(p => p.id === 'event-4')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'event-4')?.imageHint || '',
  },
  {
    id: '5',
    title: 'Data Science & Machine Learning Expo',
    date: 'January 10-12, 2025',
    location: 'New York, NY',
    description: 'Discover the latest trends and applications in data science and machine learning. Network with industry professionals and academics.',
    tags: ['Data Science', 'ML', 'Analytics'],
    imageUrl: PlaceHolderImages.find(p => p.id === 'event-5')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'event-5')?.imageHint || '',
  },
  {
    id: '6',
    title: 'Startup Pitch Night',
    date: 'January 22, 2025',
    location: 'Austin, TX',
    description: 'Watch the most promising startups pitch their ideas to a panel of venture capitalists. Your chance to see the next big thing.',
    tags: ['Startups', 'Venture Capital', 'Pitch'],
    imageUrl: PlaceHolderImages.find(p => p.id === 'event-6')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'event-6')?.imageHint || '',
  },
  {
    id: '7',
    title: 'GreenTech Innovation Forum',
    date: 'February 5, 2025',
    location: 'Virtual',
    description: 'Join sustainability leaders and innovators to discuss how technology can solve the world\'s most pressing environmental challenges.',
    tags: ['GreenTech', 'Sustainability', 'Climate'],
    imageUrl: PlaceHolderImages.find(p => p.id === 'event-7')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'event-7')?.imageHint || '',
  },
  {
    id: '8',
    title: 'Mobile Developers Conference',
    date: 'February 18-19, 2025',
    location: 'Berlin, Germany',
    description: 'The premier event for mobile developers. Learn about the latest in iOS, Android, and cross-platform development.',
    tags: ['Mobile', 'iOS', 'Android'],
    imageUrl: PlaceHolderImages.find(p => p.id === 'event-8')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'event-8')?.imageHint || '',
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
