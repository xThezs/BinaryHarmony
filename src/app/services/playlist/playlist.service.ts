import { inject, Injectable } from '@angular/core';
import { Track } from '../../utils/interfaces/track.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private http = inject(HttpClient);
  getAllTracks() : Observable<Track[]>{
    const url=`http://localhost:3030/getTracks`;
    return this.http.get<Track[]>(url);
  } 
}
