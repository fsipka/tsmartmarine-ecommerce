export type ProductType = 'yacht' | 'accessory' | 'service' | 'spare-part';

export type Product = {
  title: string;
  reviews: number;
  price: number;
  discountedPrice: number;
  id: number;
  type?: ProductType;
  description?: string;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
};
