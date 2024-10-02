import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatSelectModule, RouterModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  private auth = inject(AuthService);
  private router = inject(Router); // Ajout de l'injection du Router
  signupForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmpassword: new FormControl('', [Validators.required]),
  });
  
  errorMessage: string | null = null;

  signup() {
    if (this.signupForm.value.password !== this.signupForm.value.confirmpassword) {
      this.errorMessage = "Passwords don't match";
      return;
    }
    
    const password = this.signupForm.value.password as string;

    // Conditions de sécurité du mot de passe
    if (password.length < 8) {
      this.errorMessage = "Password must be at least 8 characters long.";
      return;
    }
    if (!/[A-Z]/.test(password)) {
      this.errorMessage = "Password must contain at least one uppercase letter.";
      return;
    }
    if (!/[0-9]/.test(password)) {
      this.errorMessage = "Password must contain at least one number.";
      return;
    }

    let body = {
      email: this.signupForm.value.email as string,
      name: this.signupForm.value.name as string,
      password: password,
      confirmpassword: this.signupForm.value.confirmpassword as string,
    };

    this.auth.signup(body).subscribe({
      next: () => {
        // Redirection vers la page de connexion après une inscription réussie
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.error.error; // Afficher l'erreur reçue du serveur
      }
    });
  }
}
