'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import type { User as FirebaseUser } from 'firebase/auth';
import type { Event } from '@/lib/types';
import { MOCK_EVENTS } from '@/components/landing/FeaturedEvents';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Calendar, MapPin, Ticket, Award, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const EVENTS_STORAGE_KEY = 'admin_events';

export default function MyEventsPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        const registrations = JSON.parse(localStorage.getItem('registrations') || '{}');
        const userRegistrations = registrations[user.uid] || [];
        
        const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
        const allEvents = storedEvents ? JSON.parse(storedEvents) : MOCK_EVENTS;
        
        const userEvents = allEvents.filter((event: Event) => userRegistrations.includes(event.id));
        setRegisteredEvents(userEvents);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const isEventCompleted = (eventDate: string) => {
    // Gracefully handle invalid date strings
    const date = new Date(eventDate);
    if (isNaN(date.getTime())) {
      return false;
    }
    const today = new Date();
    // Set time to 00:00:00 to compare dates only
    today.setHours(0, 0, 0, 0); 
    return date < today;
  };
  
  const getEventImage = (event: Event) => {
      if (event.imageUrl && (event.imageUrl.startsWith('data:') || event.imageUrl.startsWith('http'))) {
        return event.imageUrl;
      }
      const eventImage = PlaceHolderImages.find(p => p.id === `event-${event.id}`);
      return eventImage?.imageUrl || 'https://picsum.photos/seed/placeholder/600/400';
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12 text-center">
        <p>Loading your events...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-10">
        <h1 className="font-headline text-3xl md:text-4xl font-bold">My Events</h1>
        <p className="text-muted-foreground mt-2">Here are the events you've registered for.</p>
      </div>

      {registeredEvents.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold">No Registered Events</h2>
            <p className="text-muted-foreground mt-2">You haven't registered for any events yet.</p>
            <Button asChild className="mt-4">
                <Link href="/#events">Explore Events</Link>
            </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {registeredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden h-full flex flex-col">
              <CardHeader className="p-0 relative">
                <Image
                  src={getEventImage(event)}
                  alt={event.title}
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover"
                />
                {isEventCompleted(event.date) && (
                    <Badge variant="secondary" className="absolute top-2 right-2 bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Completed
                    </Badge>
                )}
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <CardTitle className="text-lg font-headline mb-2 leading-tight">{event.title}</CardTitle>
                <div className="text-sm text-muted-foreground space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex-col sm:flex-row gap-2">
                 <Button asChild variant="outline" className="w-full sm:w-auto">
                    <Link href={`/events/${event.id}/ticket`}>
                        <Ticket className="mr-2 h-4 w-4" />
                        View Ticket
                    </Link>
                </Button>
                {isEventCompleted(event.date) ? (
                  <Button asChild className="w-full sm:w-auto">
                    <Link href={`/events/${event.id}/certificate`}>
                        <Award className="mr-2 h-4 w-4" />
                        Get Certificate
                    </Link>
                  </Button>
                ) : (
                   <Button variant="ghost" disabled className="w-full sm:w-auto">
                    <Award className="mr-2 h-4 w-4" />
                    Certificate
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
