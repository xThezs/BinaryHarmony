import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const loggedInGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Vérifie si l'utilisateur est connecté
  if (!authService.isLoggedIn()) {
    // Si non connecté, redirige vers la page de connexion
    router.navigate(['/login']);
    return false;
  }
  return true; // Autorise l'accès si l'utilisateur est connecté
};
