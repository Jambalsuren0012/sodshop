import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { Product } from '../../type';

export interface ApiResponse {
  data: Product[];
}

export interface SingleProductResponse {
  data: Product;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private url = `${environment.apiBase}/products`;

  /* =========================================
     GET ALL PRODUCTS
  ========================================== */
  async getProducts(category?: string): Promise<Product[]> {
    const response = await fetch(this.url);

    const json: ApiResponse = await response.json();

    let products = json.data ?? [];

    if (category) {
      products = products.filter(
        (p: any) => String(p.category?.id) === String(category),
      );
    }

    return products.map((item: any) => ({
      ...item,
      image: this.getImageUrl(item.images?.main),
    }));
  }

  /* =========================================
     GET PRODUCT BY ID
  ========================================== */
  async getProductById(id: string): Promise<Product> {
    const response = await fetch(`${this.url}/${id}`);
    const json: SingleProductResponse = await response.json();

    const item = json.data;

    return {
      ...item,
      images: item.images,
    };
  }

  /* =========================================
     GET PRODUCTS WITH LIMIT (+ optional category)
  ========================================== */
  async getProductsWithLimit(
    limit: number,
    category?: string,
  ): Promise<Product[]> {
    let endpoint = `${this.url}?limit=${limit}`;

    if (category) {
      endpoint += `&category=${category}`;
    }

    const response = await fetch(endpoint);
    const json: ApiResponse = await response.json();

    return (json.data ?? []).map((item: any) => ({
      ...item,
      image: this.getImageUrl(item.image),
    }));
  }

  /* =========================================
     IMAGE URL FIX
  ========================================== */
  getImageUrl(imagePath?: string): string {
    if (!imagePath) return '';

    // Хэрэв API аль хэдийн full URL өгвөл шууд буцаана
    if (imagePath.startsWith('http')) return imagePath;

    // public/ авна
    const cleanPath = imagePath.replace(/^public\//, '');

    return `${environment.imgBase}/${cleanPath}`;
  }
  async getLatestProducts(): Promise<Product[]> {
    const res = await fetch(this.url);
    const json = await res.json();

    const products = json.data;

    return products
      .sort((a: any, b: any) => b.id - a.id) // newest first
      .slice(0, 4); // only 4
  }
}
