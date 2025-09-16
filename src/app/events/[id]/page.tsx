'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Event } from '@/lib/types';
import { Calendar, MapPin, Users, Ticket, CheckCircle, CreditCard } from 'lucide-react';
import { MOCK_EVENTS } from '@/components/landing/FeaturedEvents';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import type { User as FirebaseUser } from 'firebase/auth';
import { loadStripe } from '@stripe/stripe-js';
import { createCheckoutSession } from '@/app/actions/stripe';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
const EVENTS_STORAGE_KEY = 'admin_events';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const eventId = params.id as string;

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState<Event | undefined>(undefined);

  useEffect(() => {
    const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
    const allEvents = storedEvents ? JSON.parse(storedEvents) : MOCK_EVENTS;
    const currentEvent = allEvents.find((e: Event) => e.id === eventId);
    setEvent(currentEvent);
  }, [eventId]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user && event) {
        // Check local storage for registration status
        const registrations = JSON.parse(localStorage.getItem('registrations') || '{}');
        setIsRegistered(registrations[user.uid]?.includes(event.id));
      }
    });
    return () => unsubscribe();
  }, [event]);

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12 text-center">
        <h1 className="text-2xl font-bold">Event not found</h1>
        <p className="text-muted-foreground">The event you are looking for does not exist.</p>
      </div>
    );
  }

  const handleRegister = async () => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to register for an event.',
        variant: 'destructive',
      });
      router.push('/login');
      return;
    }

    setLoading(true);

    if (event.price > 0) {
      // Paid event
      try {
        const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
        const allEvents = storedEvents ? JSON.parse(storedEvents) : MOCK_EVENTS;
        const currentEvent = allEvents.find((e: Event) => e.id === eventId);
        
        if (!currentEvent) {
          throw new Error('Event details not found for payment.');
        }

        const session = await createCheckoutSession({
          priceId: `price_${event.id}`, // This assumes you have a price ID convention
          eventName: currentEvent.title,
          eventDescription: currentEvent.description,
          eventImageUrl: currentEvent.imageUrl,
          eventId: event.id,
          userId: user.uid,
        });

        if (session.sessionId) {
          const stripe = await stripePromise;
          const { error } = await stripe!.redirectToCheckout({ sessionId: session.sessionId });
          if (error) {
            toast({
              title: 'Error redirecting to checkout',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
           throw new Error('Could not create checkout session');
        }
      } catch (error: any) {
        toast({
          title: 'Payment Error',
          description: error.message || 'There was an issue with the payment process.',
          variant: 'destructive',
        });
      }
    } else {
      // Free event
      const registrations = JSON.parse(localStorage.getItem('registrations') || '{}');
      if (!registrations[user.uid]) {
        registrations[user.uid] = [];
      }
      
      if (!registrations[user.uid].includes(event.id)) {
        registrations[user.uid].push(event.id);
        localStorage.setItem('registrations', JSON.stringify(registrations));
        setIsRegistered(true);
        toast({
          title: 'Registration Successful!',
          description: `You are now registered for ${event.title}.`,
        });
        router.push(`/events/${event.id}/ticket`);
      } else {
          toast({
              title: 'Already Registered',
              description: `You are already registered for ${event.title}.`,
          });
      }
    }
     setLoading(false);
  };


  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div className="md:col-span-2">
          <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg mb-8">
            {event.imageUrl && (
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover"
                data-ai-hint={event.imageHint}
              />
            )}
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
             <div className="absolute bottom-0 left-0 p-6">
                <h1 className="font-headline text-3xl md:text-4xl font-bold text-white mb-2">{event.title}</h1>
                <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="backdrop-blur-sm bg-white/20 text-white border-0">
                        {tag}
                    </Badge>
                    ))}
                </div>
             </div>
          </div>
          
          <h2 className="font-headline text-2xl font-bold mb-4">About this event</h2>
          <p className="text-lg text-muted-foreground mb-8">{event.description}</p>

        </div>
        <div className="md:col-span-1">
          <Card className="sticky top-28">
            <CardHeader>
              <CardTitle>
                {event.price === 0 ? 'Free Event' : `Price: $${event.price}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{event.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{event.location}</span>
              </div>
               <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">1,234 attendees</span>
              </div>
              <Button size="lg" className="w-full" onClick={handleRegister} disabled={isRegistered || loading}>
                {isRegistered ? (
                    <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Registered
                    </>
                ) : (
                  event.price > 0 ?
                    <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Buy Ticket
                    </>
                    :
                    <>
                        <Ticket className="mr-2 h-5 w-5" />
                        Register Now
                    </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
