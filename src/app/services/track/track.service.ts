import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Track } from '../../utils/interfaces/track.interface';
import { Answer } from '../../utils/interfaces/answer.interface';
import { Characteristic } from '../../utils/interfaces/characteristic.interface';

@Injectable({
  providedIn: 'root',
})
export class TrackService {
  private apiUrl = 'http://localhost:3030/tracks';
  private characteristicsUrl = 'http://localhost:3030/characteristics'; // URL pour les caractéristiques

  constructor(private http: HttpClient) {}

  getTracks(collectionId: string): Observable<Track[]> {
    return this.http.get<Track[]>(`${this.apiUrl}/${collectionId}`);
  }

  getCharacteristics(trackId: number): Observable<Characteristic[]> {
    return this.http.get<Characteristic[]>(`${this.characteristicsUrl}/${trackId}`);
  }

  getAllCharacteristics(): Observable<Characteristic[]> {
    return this.http.get<Characteristic[]>(this.characteristicsUrl);
  }

  addCharacteristic(answer: Answer): Observable<Answer> {
    return this.http.post<Answer>('http://localhost:3030/answer', answer);
  }

  deleteCharacteristic(trackId: number, characteristicId: number): Observable<any> {
    const body = { trackId, characteristicId };
    return this.http.delete('http://localhost:3030/answer', { body });
  }
}
