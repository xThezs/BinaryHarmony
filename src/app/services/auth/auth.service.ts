import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs'; // Ajoutez 'BehaviorSubject' ici
import { LoginResponse } from '../../utils/interfaces/logresponse.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // BehaviorSubject pour suivre l'état d'authentification
  private authenticatedSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  
  // Observable exposé pour les autres composants
  authStatus$ = this.authenticatedSubject.asObservable();

  isAdmin(): Observable<boolean> {
    const url = `http://localhost:3030/checkAdmin`;
    return this.http.get<boolean>(url);
  }

  login(body: { email: string; password: string; }): Observable<boolean> {
    const url = `http://localhost:3030/user/login`;
    return this.http.post<LoginResponse>(url, body).pipe(map((response) => {
      localStorage.setItem("token", response.jwt);
      this.authenticatedSubject.next(true); // Émettre l'état d'authentification
      return true;
    }));
  }

  signup(body: { email: string; password: string; confirmpassword: string; name: string; }): Observable<any> {
    const url = `http://localhost:3030/user/signup`;

    return this.http.post(url, body).pipe(
      catchError((error) => {
        // Gérer les erreurs ici
        console.error('Signup error', error);
        return of({ error: error.error.message || 'An error occurred' });
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.authenticatedSubject.next(false); // Émettre l'état de déconnexion
    this.router.navigate(['/login']); // Redirection après déconnexion
  }
  
  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  getUserId(): string {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.UserId;
    }
    return 'No token';
  }
  getUserName(): string {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.name;
    }
    return 'No token';
  }
}
