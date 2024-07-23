import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  isAdmin() : Observable<boolean>{
    const url=`http://localhost:3030/checkAdmin`;
    return this.http.get<boolean>(url);
  } 

  login(body: { email: string; password: string; }){
    const url=`http://localhost:3030/user/login`;
    return this.http.post(url,body)
  }


  
}
