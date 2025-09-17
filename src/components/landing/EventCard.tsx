import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Event } from '@/lib/types';
import { Calendar, MapPin } from 'lucide-react';

type EventCardProps = {
  event: Event;
};

export default function EventCard({ event }: EventCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
      <Link href={`/events/${event.id}`} className="flex flex-col flex-grow">
        <CardHeader className="p-0 relative">
          <Image
            src={event.imageUrl}
            alt={event.title}
            width={600}
            height={400}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={event.imageHint}
          />
           <Badge variant={event.price === 0 ? "secondary" : "default"} className="absolute top-2 right-2">
            {event.price === 0 ? 'Free' : `$${event.price}`}
          </Badge>
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
          <p className="text-sm mt-3 line-clamp-3">{event.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
