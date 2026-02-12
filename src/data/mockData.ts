export interface House {
  id: string;
  title: string;
  city: string;
  area: string;
  price: number;
  rooms: number;
  maxPeople: number;
  environment: string[];
  description: string;
  images: string[];
  ownerPhone: string;
  ownerId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export interface City {
  id: string;
  name: {
    en: string;
    am: string;
    om: string;
  };
  houseCount: number;
  image: string;
}

export const ethiopianCities: City[] = [
  {
    id: 'addis-ababa',
    name: { en: 'Addis Ababa', am: 'አዲስ አበባ', om: 'Finfinnee' },
    houseCount: 1250,
    image: '/cities/addis-ababa.jpg',
  },
  {
    id: 'dire-dawa',
    name: { en: 'Dire Dawa', am: 'ድሬ ዳዋ', om: 'Dirree Dhawaa' },
    houseCount: 320,
    image: '/cities/dire-dawa.jpg',
  },
  {
    id: 'mekelle',
    name: { en: 'Mekelle', am: 'መቀሌ', om: 'Maqalee' },
    houseCount: 280,
    image: '/cities/mekelle.jpg',
  },
  {
    id: 'gondar',
    name: { en: 'Gondar', am: 'ጎንደር', om: 'Gondar' },
    houseCount: 195,
    image: '/cities/gondar.jpg',
  },
  {
    id: 'hawassa',
    name: { en: 'Hawassa', am: 'ሀዋሳ', om: 'Hawaasaa' },
    houseCount: 410,
    image: '/cities/hawassa.jpg',
  },
  {
    id: 'bahir-dar',
    name: { en: 'Bahir Dar', am: 'ባህር ዳር', om: 'Baahir Daar' },
    houseCount: 235,
    image: '/cities/bahir-dar.jpg',
  },
  {
    id: 'jimma',
    name: { en: 'Jimma', am: 'ጅማ', om: 'Jimmaa' },
    houseCount: 175,
    image: '/cities/jimma.jpg',
  },
  {
    id: 'adama',
    name: { en: 'Adama', am: 'አዳማ', om: 'Adaamaa' },
    houseCount: 290,
    image: '/cities/adama.jpg',
  },
  {
    id: 'harar',
    name: { en: 'Harar', am: 'ሐረር', om: 'Harar' },
    houseCount: 120,
    image: '/cities/harar.jpg',
  },
  {
    id: 'dessie',
    name: { en: 'Dessie', am: 'ደሴ', om: 'Dassee' },
    houseCount: 150,
    image: '/cities/dessie.jpg',
  },
];

export const mockHouses: House[] = [
  {
    id: '1',
    title: 'Modern 2BR Apartment in Bole',
    city: 'addis-ababa',
    area: 'Bole',
    price: 18000,
    rooms: 2,
    maxPeople: 4,
    environment: ['quiet', 'safe', 'nearTransport'],
    description: 'Beautiful modern apartment with stunning city views. Located in the heart of Bole, close to the airport and shopping centers. Features include air conditioning, 24/7 security, and parking.',
    images: ['/houses/house1.jpg', '/houses/house1-2.jpg'],
    ownerPhone: '+251911234567',
    ownerId: 'owner1',
    status: 'approved',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Cozy Studio near CMC',
    city: 'addis-ababa',
    area: 'CMC',
    price: 8500,
    rooms: 1,
    maxPeople: 2,
    environment: ['quiet', 'nearMarket'],
    description: 'Perfect for students or young professionals. Compact but well-designed studio with modern amenities. Walking distance to public transport and local markets.',
    images: ['/houses/house2.jpg'],
    ownerPhone: '+251922345678',
    ownerId: 'owner2',
    status: 'approved',
    createdAt: new Date('2024-01-18'),
  },
  {
    id: '3',
    title: 'Spacious 3BR Family House',
    city: 'hawassa',
    area: 'Tabor',
    price: 12000,
    rooms: 3,
    maxPeople: 6,
    environment: ['quiet', 'safe', 'nearSchool'],
    description: 'Large family home near Lake Hawassa with beautiful garden. Three bedrooms, two bathrooms, and a spacious living area. Perfect for families with children.',
    images: ['/houses/house3.jpg', '/houses/house3-2.jpg', '/houses/house3-3.jpg'],
    ownerPhone: '+251933456789',
    ownerId: 'owner3',
    status: 'approved',
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '4',
    title: 'Luxury Villa with Pool',
    city: 'addis-ababa',
    area: 'Old Airport',
    price: 45000,
    rooms: 5,
    maxPeople: 10,
    environment: ['quiet', 'safe'],
    description: 'Exclusive villa with private swimming pool and garden. Features 5 bedrooms, 4 bathrooms, modern kitchen, and servant quarters. Ideal for diplomats or executives.',
    images: ['/houses/house4.jpg'],
    ownerPhone: '+251944567890',
    ownerId: 'owner4',
    status: 'approved',
    createdAt: new Date('2024-01-22'),
  },
  {
    id: '5',
    title: 'Budget-Friendly Room in Piassa',
    city: 'addis-ababa',
    area: 'Piassa',
    price: 4500,
    rooms: 1,
    maxPeople: 2,
    environment: ['nearTransport', 'nearMarket'],
    description: 'Affordable room in the historic Piassa area. Shared bathroom. Great for those on a budget who want to be in the city center.',
    images: ['/houses/house5.jpg'],
    ownerPhone: '+251955678901',
    ownerId: 'owner5',
    status: 'pending',
    createdAt: new Date('2024-01-25'),
  },
  {
    id: '6',
    title: 'Lake View Apartment',
    city: 'bahir-dar',
    area: 'Kebele 14',
    price: 15000,
    rooms: 2,
    maxPeople: 4,
    environment: ['quiet', 'safe'],
    description: 'Stunning apartment overlooking Lake Tana. Watch the sunset from your balcony. Two bedrooms, modern kitchen, and peaceful surroundings.',
    images: ['/houses/house6.jpg'],
    ownerPhone: '+251966789012',
    ownerId: 'owner6',
    status: 'approved',
    createdAt: new Date('2024-01-28'),
  },
];

export const environmentOptions = [
  { id: 'quiet', label: { en: 'Quiet', am: 'ጸጥ ያለ', om: 'Callisaa' } },
  { id: 'safe', label: { en: 'Safe', am: 'ደህንነቱ የተጠበቀ', om: 'Nageenya' } },
  { id: 'nearTransport', label: { en: 'Near Transport', am: 'ለትራንስፖርት ቅርብ', om: 'Geejjiba Dhihoo' } },
  { id: 'nearMarket', label: { en: 'Near Market', am: 'ለገበያ ቅርብ', om: 'Gabaa Dhihoo' } },
  { id: 'nearSchool', label: { en: 'Near School', am: 'ለትምህርት ቤት ቅርብ', om: 'Mana Barumsaa Dhihoo' } },
];
