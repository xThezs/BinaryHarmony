import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Collection } from '../../utils/interfaces/collection.interface';
import { Category } from '../../utils/interfaces/category.interface'; // Assurez-vous d'importer l'interface Category

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  private apiUrl = 'http://localhost:3030/collections';
  private categoryApiUrl = 'http://localhost:3030/categories'; // URL pour l'API des catégories

  constructor(private http: HttpClient) {}

  addCollection(name: string, publicOption: boolean, userId: string): Observable<Collection> {
    const body = {
      name,
      public: publicOption,
      userId,
    };

    return this.http.post<Collection>(this.apiUrl, body);
  }

  getCollections(userId: string): Observable<Collection[]> {
    return this.http.get<Collection[]>(`${this.apiUrl}/${userId}`);
  }

  deleteCollection(collectionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${collectionId}`);
  }

  // Nouvelle méthode pour récupérer les catégories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoryApiUrl);
  }
}
