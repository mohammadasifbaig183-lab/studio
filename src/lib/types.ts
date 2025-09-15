export type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  tags: string[];
  imageUrl: string;
  imageHint: string;
  price: number; // 0 for free events
};

export type Sponsor = {
  id: string;
  name: string;
  logoUrl: string;
  logoHint: string;
};
