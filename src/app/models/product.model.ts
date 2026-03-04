export interface Product {
  id: number;
  name: string; // title биш name
  description: string;
  price: number;
  discount_price: number | null;
  sku: string;
  stock: number;
  brand: string;
  status: number;

  images: {
    main: string;
    gallery: string[];
  };
}
