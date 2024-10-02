import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { RouterModule } from '@angular/router'; // Assurez-vous d'importer RouterModule

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule], // Assurez-vous que RouterModule est ici
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.authStatus$.subscribe(status => {
      this.isAuthenticated = status;
    });
    this.checkAuthentication();
  }

  checkAuthentication(): void {
    this.isAuthenticated = this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
  }
}
