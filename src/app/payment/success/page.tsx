'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const eventId = searchParams.get('eventId');
    const userId = searchParams.get('userId');

    if (eventId && userId) {
      // In a real app, you would verify the session_id with your backend.
      // For this prototype, we'll optimistically grant access.
      const registrations = JSON.parse(localStorage.getItem('registrations') || '{}');
      if (!registrations[userId]) {
        registrations[userId] = [];
      }
      
      if (!registrations[userId].includes(eventId)) {
        registrations[userId].push(eventId);
        localStorage.setItem('registrations', JSON.stringify(registrations));
        
        toast({
          title: 'Payment Successful!',
          description: `Your registration is confirmed.`,
        });
      }
    } else {
        // Handle case where params are missing
        toast({
            title: 'Something went wrong',
            description: 'Could not confirm your registration. Please contact support.',
            variant: 'destructive',
        });
        router.push('/');
    }
  }, [searchParams, router, toast]);

  const eventId = searchParams.get('eventId');

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <div className="max-w-md mx-auto">
        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold font-headline mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your purchase. Your registration is confirmed and your ticket is ready.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href={`/events/${eventId}/ticket`}>View Your Ticket</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/my-events">Go to My Events</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
