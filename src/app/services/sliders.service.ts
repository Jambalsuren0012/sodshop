import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class SlidersService {
  private baseUrl = `${environment.apiBase}/sliders`;

  constructor(private http: HttpClient) {}

  getSliders() {
    return this.http.get<any>(this.baseUrl).pipe(map((res) => res.data));
  }

  getImageUrl(path: string) {
    return `${environment.imgBase}${path}`;
  }
}
