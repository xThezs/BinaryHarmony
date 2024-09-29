import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']  // Correction: styleUrls avec 's'
})
export class NavbarComponent implements OnInit {
  isAuthenticated: boolean = false;

  ngOnInit(): void {
    this.checkAuthentication();
  }

  // Méthode pour vérifier la présence d'un token
  checkAuthentication(): void {
    const token = localStorage.getItem('token');
    this.isAuthenticated = !!token; // Si un token existe, l'utilisateur est connecté
  }

  // Méthode pour gérer la déconnexion
  logout(): void {
    localStorage.removeItem('token'); // Supprimer le token
    this.isAuthenticated = false; // Mettre à jour l'état d'authentification

    //Option Redirect après logout
    // this.router.navigate(['/login']); // Rediriger vers la page de login après la déconnexion
  }
}
