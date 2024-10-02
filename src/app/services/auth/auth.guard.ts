import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isLoggedIn()) {
    // Redirige l'utilisateur vers la page d'accueil s'il est déjà connecté
    router.navigate(['/']);
    return false;
  }
  return true; // Autorise l'accès si non connecté
};

