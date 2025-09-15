
import Image from 'next/image';
import type { Sponsor } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const MOCK_SPONSORS: Sponsor[] = [
  { id: '1', name: 'InnovateCorp', logoUrl: PlaceHolderImages.find(p => p.id === 'sponsor-1')?.imageUrl || '', logoHint: PlaceHolderImages.find(p => p.id === 'sponsor-1')?.imageHint || '' },
  { id: '2', name: 'FutureTech', logoUrl: PlaceHolderImages.find(p => p.id === 'sponsor-2')?.imageUrl || '', logoHint: PlaceHolderImages.find(p => p.id === 'sponsor-2')?.imageHint || '' },
  { id: '3', name: 'QuantumLeap', logoUrl: PlaceHolderImages.find(p => p.id === 'sponsor-3')?.imageUrl || '', logoHint: PlaceHolderImages.find(p => p.id === 'sponsor-3')?.imageHint || '' },
  { id: '4', name: 'Twitter', logoUrl: PlaceHolderImages.find(p => p.id === 'sponsor-4')?.imageUrl || '', logoHint: PlaceHolderImages.find(p => p.id === 'sponsor-4')?.imageHint || '' },
  { id: '5', name: 'Instagram', logoUrl: PlaceHolderImages.find(p => p.id === 'sponsor-5')?.imageUrl || '', logoHint: PlaceHolderImages.find(p => p.id === 'sponsor-5')?.imageHint || '' },
  { id: '6', name: 'GitHub', logoUrl: PlaceHolderImages.find(p => p.id === 'sponsor-6')?.imageUrl || '', logoHint: PlaceHolderImages.find(p => p.id === 'sponsor-6')?.imageHint || '' },
  { id: '7', name: 'Apex Innovations', logoUrl: PlaceHolderImages.find(p => p.id === 'sponsor-7')?.imageUrl || '', logoHint: PlaceHolderImages.find(p => p.id === 'sponsor-7')?.imageHint || '' },
  { id: '8', name: 'StellarWorks', logoUrl: PlaceHolderImages.find(p => p.id === 'sponsor-8')?.imageUrl || '', logoHint: PlaceHolderImages.find(p => p.id === 'sponsor-8')?.imageHint || '' },
];


export default function Sponsors() {
  return (
    <section className="py-12 md:py-20">
      <div className="text-center mb-10">
        <h2 className="font-headline text-3xl md:text-4xl font-bold">Our Sponsors</h2>
        <p className="text-muted-foreground mt-2">Powering the future of events together.</p>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
        {MOCK_SPONSORS.map((sponsor) => (
          <div key={sponsor.id} className="grayscale hover:grayscale-0 transition-all duration-300">
            <Image
              src={sponsor.logoUrl}
              alt={sponsor.name}
              width={150}
              height={50}
              className="object-contain"
              data-ai-hint={sponsor.logoHint}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

    