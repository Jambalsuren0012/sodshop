export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount_price: number | null;
  sku: string;
  stock: number;
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

export interface PaymentInfoData {
  address: string;
  cardNumber: number;
  expirationDate: number;
  cvv: number;
  nameOnCard: string;
}
export interface Category {
  id: number;
  name: string;
  parent: {
    id: number;
    name: string;
  } | null;
  image_url: string | null;
  status: number;
}

export interface CategoryApiResponse {
  data: Category[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}
export interface Slider {
  id: number;
  title: string;
  subtitle: string;
  button_text: string | null;
  button_link: string | null;
  image_url: string;
  sort_order: number;
  status: number;
}
// type.ts
export interface Category {
  id: number;
  name: string;
  image_url: string | null;
  status: number;
}

export interface CategoryApiResponse {
  data: Category[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}
