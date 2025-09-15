'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Event } from '@/lib/types';

interface EventFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (event: Omit<Event, 'id' | 'imageHint'>) => void;
  event: Event | null;
}

export default function EventForm({ isOpen, onOpenChange, onSave, event }: EventFormProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDate(event.date);
      setLocation(event.location);
      setDescription(event.description);
      setTags(event.tags.join(', '));
      setPrice(event.price);
      setImageUrl(event.imageUrl);
      setImagePreview(event.imageUrl);
    } else {
      // Reset form when adding a new event
      setTitle('');
      setDate('');
      setLocation('');
      setDescription('');
      setTags('');
      setPrice(0);
      setImageUrl('');
      setImagePreview(null);
    }
  }, [event, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    const eventData = {
      title,
      date,
      location,
      description,
      tags: tags.split(',').map(tag => tag.trim()),
      price: Number(price),
      imageUrl: imageUrl || `https://picsum.photos/seed/e${Math.random()}/600/400`,
    };
    onSave(eventData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Add New Event'}</DialogTitle>
          <DialogDescription>
            {event ? 'Update the details for this event.' : 'Enter the details for the new event.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input id="price" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Input id="date" value={date} onChange={(e) => setDate(e.target.value)} className="col-span-3" placeholder="Month DD, YYYY" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              Tags
            </Label>
            <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className="col-span-3" placeholder="AI, Tech,..." />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
             <Label htmlFor="image" className="text-right">
              Image
            </Label>
            <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="col-span-3" />
          </div>
          {imagePreview && (
            <div className="col-span-4 flex justify-center">
                <Image src={imagePreview} alt="Event image preview" width={200} height={150} className="rounded-md object-cover" />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
