export type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  tags: string[];
  imageUrl: string;
  imageHint: string;
};

export type Sponsor = {
  id: string;
  name: string;
  logoUrl: string;
  logoHint: string;
};
