import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, Observable, Subscriber, tap, throwError } from 'rxjs';
import { LoginResponse } from '../../utils/interfaces/logresponse.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router  =  inject(Router);
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
  signup(body:{ email:string; password:string; confirmpassword :string; name:string}){
    const url=`http://localhost:3030/user/signup`;
    if(body.password==body.confirmpassword){
      this.http.post(url,body).subscribe();
      console.log("User Created");
      return this.router.navigate(['/login']);
    }  
    return console.log("Password doesn't match");

  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn() {
    return localStorage.getItem('token') !== null;
  }


  
}
