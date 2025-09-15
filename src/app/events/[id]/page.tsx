'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Event } from '@/lib/types';
import { Calendar, MapPin, Users, Ticket, CheckCircle } from 'lucide-react';
import { MOCK_EVENTS } from '@/components/landing/FeaturedEvents';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import type { User as FirebaseUser } from 'firebase/auth';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const eventId = params.id as string;

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  
  const event: Event | undefined = MOCK_EVENTS.find(e => e.id === eventId);

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

  const handleRegister = () => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to register for an event.',
        variant: 'destructive',
      });
      router.push('/login');
      return;
    }

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
    } else {
        toast({
            title: 'Already Registered',
            description: `You are already registered for ${event.title}.`,
        });
    }
  };


  const eventImage = PlaceHolderImages.find(p => p.id === `event-${event.id}`);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div className="md:col-span-2">
          <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg mb-8">
            {eventImage && (
              <Image
                src={eventImage.imageUrl}
                alt={event.title}
                fill
                className="object-cover"
                data-ai-hint={eventImage.imageHint}
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
              <CardTitle>Event Details</CardTitle>
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
              <Button size="lg" className="w-full" onClick={handleRegister} disabled={isRegistered}>
                {isRegistered ? (
                    <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Registered
                    </>
                ) : (
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
