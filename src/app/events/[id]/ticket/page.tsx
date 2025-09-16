'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import type { User as FirebaseUser } from 'firebase/auth';
import { MOCK_EVENTS } from '@/components/landing/FeaturedEvents';
import type { Event } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';

const EVENTS_STORAGE_KEY = 'admin_events';

export default function TicketPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
        const allEvents = storedEvents ? JSON.parse(storedEvents) : MOCK_EVENTS;
        const currentEvent = allEvents.find((e: Event) => e.id === eventId);
        
        if (currentEvent) {
          const registrations = JSON.parse(localStorage.getItem('registrations') || '{}');
          const userRegistrations = registrations[currentUser.uid] || [];
          if (userRegistrations.includes(eventId)) {
            setEvent(currentEvent);
          } else {
            router.push(`/events/${eventId}`); // Not registered
          }
        } else {
          router.push('/my-events'); // Event not found
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [eventId, router]);

  const getEventImage = (event: Event) => {
      if (event.imageUrl && (event.imageUrl.startsWith('data:') || event.imageUrl.startsWith('http'))) {
        return event.imageUrl;
      }
      // Fallback for older events that might not have a full URL
      const mockEvent = MOCK_EVENTS.find(e => e.id === event.id);
      return mockEvent?.imageUrl || 'https://picsum.photos/seed/placeholder/600/400';
  }

  if (loading || !user || !event) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12 text-center">
        <p>Loading your ticket...</p>
      </div>
    );
  }

  const ticketId = `${user.uid.slice(0, 4)}-${event.id}-${Math.random().toString(36).substring(2, 6)}`.toUpperCase();

  const qrCodeData = JSON.stringify({
      ticketId: ticketId,
      attendee: user.displayName || 'Valued Guest',
      event: event.title,
  });
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrCodeData)}&size=128x128&bgcolor=0-0-0-0&color=fff`;


  return (
    <div className="container mx-auto px-4 py-8 md:py-12 flex justify-center items-center">
      <Card className="w-full max-w-md shadow-2xl relative overflow-hidden bg-card">
          <Image src={getEventImage(event)} alt={event.title} width={600} height={400} className="w-full h-40 object-cover"/>
          <div className="absolute top-0 left-0 w-full h-40 bg-black/50" />
        <CardHeader className="text-center relative -mt-16 z-10">
            <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg inline-block">
                <CardTitle className="font-headline text-3xl">{event.title}</CardTitle>
                <CardDescription>Your Official Event Ticket</CardDescription>
            </div>
        </CardHeader>
        <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-6">
                <Image src={qrCodeUrl} alt="QR Code" width={128} height={128} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-left">
                <div>
                    <p className="text-muted-foreground">Attendee</p>
                    <p className="font-semibold">{user.displayName || 'Valued Guest'}</p>
                </div>
                 <div>
                    <p className="text-muted-foreground">Ticket ID</p>
                    <p className="font-semibold font-mono">{ticketId}</p>
                </div>
                 <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-semibold">{event.date}</p>
                </div>
                 <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-semibold">{event.location}</p>
                </div>
            </div>
        </CardContent>
        <Separator />
        <CardFooter className="p-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Powered by SynergySphere</span>
        </CardFooter>
      </Card>
    </div>
  );
}
