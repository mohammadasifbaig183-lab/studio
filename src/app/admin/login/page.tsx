'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// This is a simplified admin auth. In a real app, you'd use custom claims.
const ADMIN_EMAIL = "admin@gmail.com";

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleSignIn = async () => {
     if (email.toLowerCase() !== ADMIN_EMAIL) {
      toast({
        title: 'Access Denied',
        description: 'This email address is not authorized for admin access.',
        variant: 'destructive',
      });
      return;
    }
    try {
      // For this prototype, we'll use a hardcoded password check.
      // In a real app, you should rely solely on Firebase Authentication for security.
      if (password !== 'admin@123') {
        toast({
          title: 'Invalid Credentials',
          description: 'The password you entered is incorrect.',
          variant: 'destructive',
        });
        return;
      }
      
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Admin Login Successful',
        description: 'Redirecting to the dashboard...',
      });
      router.push('/admin');
    } catch (error: any) {
       // Gracefully handle if the admin account doesn't exist in Firebase Auth
       if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
         toast({
            title: 'Authentication Failed',
            description: 'Please create an account for the admin email in your Firebase project.',
            variant: 'destructive',
         });
       } else {
        toast({
            title: 'Error signing in',
            description: error.message,
            variant: 'destructive',
        });
       }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            <Shield className="h-7 w-7 text-primary" />
            <span className="font-bold font-headline text-2xl">
              SynergySphere
            </span>
          </div>
          <CardTitle className="text-2xl font-headline">Admin Access</CardTitle>
          <CardDescription>Sign in to manage the platform.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="admin@gmail.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="admin@123" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={handleSignIn}>Sign In</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
