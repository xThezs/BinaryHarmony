import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, Observable, Subscriber, tap, throwError } from 'rxjs';
import { LoginResponse } from '../utils/interfaces/logresponse.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  isAdmin() : Observable<boolean>{
    const url=`http://localhost:3030/checkAdmin`;
    return this.http.get<boolean>(url);
  } 

  
  login(body: { email: string; password: string; }): Observable<boolean>{
    const url=`http://localhost:3030/user/login`;    
    return this.http.post<LoginResponse>(url,body).pipe(map((response)=>{
      localStorage.setItem("token",response.jwt);
      return true;
    }));
  }


  
}
