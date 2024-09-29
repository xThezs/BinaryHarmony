import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://localhost:3030/send-email';

  constructor(private http: HttpClient) {}

  sendEmail(emailData: { to: string; subject: string; body: string }): Observable<any> {
    return this.http.post(this.apiUrl, emailData);
  }
}