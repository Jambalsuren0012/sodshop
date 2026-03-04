import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Slider {
  subtitle: any;
  image_url: string;
  id: number;
  title: string;
  description?: string;
  image: string;
  // Add other properties as needed
}

export interface SliderApiResponse {
  data: Slider[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class SlidersService {
  private baseUrl = 'https://sodtech.mn/admin/api/sliders';

  constructor(private http: HttpClient) {}

  getSliders(): Observable<Slider[]> {
    return this.http
      .get<SliderApiResponse>(this.baseUrl)
      .pipe(map((res) => res.data));
  }
}
