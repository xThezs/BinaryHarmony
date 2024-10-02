import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule, 
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Correction du nom de propriété
})
export class LoginComponent {
  public jwt: any;
  private auth = inject(AuthService);
  private router = inject(Router);
  
  loginForm = new FormGroup({
    login: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  login() {
    if (this.loginForm.valid) {
      const body = {
        email: this.loginForm.value.login?? '', // Valeur par défaut si undefined
        password: this.loginForm.value.password ?? '', // Valeur par défaut si undefined
      };
  
      this.auth.login(body).subscribe({
        next: (isLogin) => {
          if (isLogin) {
            console.log("Connexion réussie !");
            this.router.navigate(['/']);
          } else {
            console.log("Échec de la connexion");
            alert("Échec de la connexion : Identifiants incorrects");
          }
        },
        error: (err) => {
          console.error("Erreur de connexion", err);
          alert("Échec de la connexion : " + (err.error || 'Erreur inconnue'));
        },
      });
    } else {
      alert("Veuillez remplir tous les champs obligatoires.");
    }
  }
  
}


