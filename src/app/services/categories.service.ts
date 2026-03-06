import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Category, CategoryApiResponse } from '../../type';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBase}/categories`;

  getCategories() {
    return this.http
      .get<CategoryApiResponse>(this.baseUrl)
      .pipe(map((res) => res.data));
  }

  getParentCategories() {
    return this.getCategories().pipe(
      map((cats) => cats.filter((cat) => !cat.parent)),
    );
  }

  getChildCategories(parentId: number) {
    return this.getCategories().pipe(
      map((cats) => cats.filter((cat) => cat.parent?.id === parentId)),
    );
  }
}
