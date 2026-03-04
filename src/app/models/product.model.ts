export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount_price: number | null;
  sku: string;
  quantity: number;
  brand: string;
  status: number;

  category: {
    id: number;
    name: string;
  };

  images: {
    main: string | null;
    gallery: string[];
  };
}
