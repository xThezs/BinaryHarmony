import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Track } from '../../utils/interfaces/track.interface';

@Injectable({
  providedIn: 'root',
})
export class TrackService {
  private apiUrl = 'http://localhost:3030/tracks';

  constructor(private http: HttpClient) {}

  getTracks(collectionId: string): Observable<Track[]> {
    return this.http.get<Track[]>(`${this.apiUrl}/${collectionId}`);
  }
}