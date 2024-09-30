import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Collection } from '../../utils/interfaces/collection.interface';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  private apiUrl = 'http://localhost:3030/collection';

  constructor(private http: HttpClient) {}

  addCollection(name: string, publicOption: boolean, userId: string): Observable<Collection> {
    const body = {
      name,
      public: publicOption,
      userId,
    };
  
    return this.http.post<Collection>(this.apiUrl, body); // Assurez-vous que le type de retour est Collection
  }

  getCollections(userId: string): Observable<Collection[]> {
    console.log(this.http.get<Collection[]>(`${this.apiUrl}/${userId}`), userId); // Ajoutez cette ligne
    return this.http.get<Collection[]>(`${this.apiUrl}/${userId}`); 
  }
 
}
