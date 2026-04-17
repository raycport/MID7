export interface Ingredient {
  id: string;
  name: string;
  icon: string; // URL to icon
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  type: 'food' | 'market';
  ingredients?: Ingredient[];
}

export interface CartItem extends Product {
  quantity: number;
}
