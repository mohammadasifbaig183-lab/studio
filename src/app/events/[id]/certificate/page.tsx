'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import type { User as FirebaseUser } from 'firebase/auth';
import { MOCK_EVENTS } from '@/components/landing/FeaturedEvents';
import type { Event } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CertificatePage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isEventCompleted = (eventDate: string) => {
      return new Date(eventDate) < new Date();
    };

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const currentEvent = MOCK_EVENTS.find(e => e.id === eventId);
        if (currentEvent) {
          const registrations = JSON.parse(localStorage.getItem('registrations') || '{}');
          const userRegistrations = registrations[currentUser.uid] || [];
          if (userRegistrations.includes(eventId) && isEventCompleted(currentEvent.date)) {
            setEvent(currentEvent);
          } else {
            router.push(`/my-events`); // Not registered or event not completed
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

  const handlePrint = () => {
    window.print();
  };

  if (loading || !user || !event) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12 text-center">
        <p>Loading your certificate...</p>
      </div>
    );
  }
  
  const issueDate = new Date(event.date);
  issueDate.setDate(issueDate.getDate() + 1); // Day after event

  return (
    <div className="bg-muted/40 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
         <Card className="p-8 md:p-12 border-2 border-primary shadow-2xl relative">
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 h-16 w-16 text-primary/10">
                <Award className="h-full w-full"/>
            </div>
             <div className="absolute bottom-4 left-4 h-16 w-16 text-primary/10">
                <Sparkles className="h-full w-full"/>
            </div>

           <CardContent className="text-center relative z-10">
             <div className="flex justify-center items-center gap-2 mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
                <span className="font-bold font-headline text-2xl">
                SynergySphere
                </span>
            </div>
            <p className="text-lg text-muted-foreground mb-4">Certificate of Participation</p>
            <p className="text-muted-foreground mb-6">This certificate is proudly presented to</p>
            <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">{user.displayName || 'Valued Attendee'}</h1>
            <p className="text-lg max-w-2xl mx-auto text-muted-foreground">for successfully participating and completing the event</p>
            <h2 className="font-headline text-3xl font-semibold my-6 text-primary">{event.title}</h2>

            <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 text-muted-foreground mt-10">
                <div className="text-center">
                    <p className="font-semibold border-b pb-1">Event Date</p>
                    <p className="pt-1">{event.date}</p>
                </div>
                 <div className="text-center">
                    <p className="font-semibold border-b pb-1">Date Issued</p>
                    <p className="pt-1">{issueDate.toLocaleDateString()}</p>
                </div>
            </div>
           </CardContent>
        </Card>
        <div className="text-center mt-8">
            <Button onClick={handlePrint}>Print or Save Certificate</Button>
        </div>
      </div>
    </div>
  );
}
