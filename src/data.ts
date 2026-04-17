import { Product } from './types';

export const FOOD_ITEMS: Product[] = [
  {
    id: 'f1',
    name: 'Adobo Rice Bowl',
    price: 350,
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&q=80&w=800',
    category: 'Rice Bowls',
    type: 'food',
    ingredients: [
      { id: 'i1', name: 'Garlic', icon: '🧄' },
      { id: 'i2', name: 'Onion', icon: '🧅' },
      { id: 'i3', name: 'Chili', icon: '🌶️' },
      { id: 'i4', name: 'Ginger', icon: '🫚' },
    ]
  },
  {
    id: 'f2',
    name: 'Pork Sisig',
    price: 420,
    image: 'https://images.unsplash.com/photo-1625938146369-adc83368bca7?auto=format&fit=crop&q=80&w=800',
    category: 'Main Dish',
    type: 'food',
    ingredients: [
      { id: 'i1', name: 'Garlic', icon: '🧄' },
      { id: 'i3', name: 'Chili', icon: '🌶️' },
    ]
  },
  {
    id: 'f3',
    name: 'Beef Pares',
    price: 380,
    image: 'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?auto=format&fit=crop&q=80&w=800',
    category: 'Soup',
    type: 'food',
    ingredients: [
      { id: 'i1', name: 'Garlic', icon: '🧄' },
      { id: 'i4', name: 'Ginger', icon: '🫚' },
    ]
  }
];

export const MARKET_ITEMS: Product[] = [
  {
    id: 'm1',
    name: 'Coconut Oil',
    price: 850,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
    category: 'Pantry',
    type: 'market'
  },
  {
    id: 'm2',
    name: 'Calamansi Extract',
    price: 240,
    image: 'https://images.unsplash.com/photo-1563170351-be32cbd888ba?auto=format&fit=crop&q=80&w=800',
    category: 'Pantry',
    type: 'market'
  },
  {
    id: 'm3',
    name: 'Handwoven Basket',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1591034331579-3733917865f3?auto=format&fit=crop&q=80&w=800',
    category: 'Home',
    type: 'market'
  }
];
