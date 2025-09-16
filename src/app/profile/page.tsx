'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import type { User as FirebaseUser } from 'firebase/auth';
import type { Event } from '@/lib/types';
import { MOCK_EVENTS } from '@/components/landing/FeaturedEvents';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from 'firebase/auth';
import { Award, View } from 'lucide-react';

const EVENTS_STORAGE_KEY = 'admin_events';

export default function ProfilePage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [completedEvents, setCompletedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || '');

        const registrations = JSON.parse(localStorage.getItem('registrations') || '{}');
        const userRegistrations = registrations[currentUser.uid] || [];
        
        const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
        const allEvents = storedEvents ? JSON.parse(storedEvents) : MOCK_EVENTS;
        
        const userEvents = allEvents.filter((event: Event) => userRegistrations.includes(event.id));

        const isEventCompleted = (eventDate: string) => {
            const date = new Date(eventDate);
            if (isNaN(date.getTime())) return false;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date < today;
        };

        setCompletedEvents(userEvents.filter(event => isEventCompleted(event.date)));

      } else {
        router.push('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name[0];
  }

  const handleUpdateProfile = async () => {
    if (user && displayName !== user.displayName) {
      try {
        await updateProfile(user, { displayName });
        toast({
          title: 'Profile Updated',
          description: 'Your display name has been successfully updated.',
        });
        // Force a reload of the user object to reflect changes
        setUser({ ...user, displayName: displayName } as FirebaseUser);
      } catch (error: any) {
        toast({
          title: 'Error updating profile',
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  };

  if (loading || !user) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12 text-center">
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-2xl">
      <div className="mb-10">
        <h1 className="font-headline text-3xl md:text-4xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and view your achievements.</p>
      </div>

      <div className="space-y-8">
        <Card>
            <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                <AvatarFallback className="text-2xl">{getInitials(user.displayName)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold text-lg">{user.displayName}</p>
                    <p className="text-muted-foreground">{user.email}</p>
                </div>
            </div>
            <Separator />
            <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input 
                id="displayName" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email || ''} disabled />
                <p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
            </div>
            <Button onClick={handleUpdateProfile}>Update Profile</Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>My Certificates</CardTitle>
                <CardDescription>A collection of all the certificates you've earned.</CardDescription>
            </CardHeader>
            <CardContent>
                {completedEvents.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed rounded-lg">
                        <Award className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No Certificates Yet</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Attend and complete events to earn certificates.</p>
                    </div>
                ) : (
                    <ul className="divide-y">
                        {completedEvents.map((event) => (
                            <li key={event.id} className="flex items-center justify-between py-3">
                                <div>
                                    <p className="font-semibold">{event.title}</p>
                                    <p className="text-sm text-muted-foreground">Completed on: {new Date(event.date).toLocaleDateString()}</p>
                                </div>
                                <Button asChild variant="outline" size="sm">
                                    <Link href={`/events/${event.id}/certificate`}>
                                        <View className="mr-2 h-4 w-4" />
                                        View
                                    </Link>
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
