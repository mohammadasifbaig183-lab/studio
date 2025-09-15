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
        const userEvents = MOCK_EVENTS.filter(event => userRegistrations.includes(event.id));
        setRegisteredEvents(userEvents);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const isEventCompleted = (eventDate: string) => {
    return new Date(eventDate) < new Date();
  };

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
                  src={event.imageUrl}
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
                 <Button variant="outline" className="w-full sm:w-auto">
                    <Ticket className="mr-2 h-4 w-4" />
                    View Ticket
                </Button>
                {isEventCompleted(event.date) ? (
                  <Button className="w-full sm:w-auto">
                    <Award className="mr-2 h-4 w-4" />
                    Get Certificate
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
