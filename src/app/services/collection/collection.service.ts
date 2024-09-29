import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  private apiUrl = 'http://localhost:3030/collection';

  constructor(private http: HttpClient) {}

  addCollection(name: string, publicOption: boolean, userId: string): Observable<any> {
    const body = {
      name,
      public: publicOption,
      userId,
    };

    return this.http.post(this.apiUrl, body);
  }

  getCollections(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}`); 
  }
 
}
