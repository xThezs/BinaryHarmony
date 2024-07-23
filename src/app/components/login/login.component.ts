import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule, 
    MatSelectModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public jwt :any ;
  private auth=inject(AuthService);
  loginForm = new FormGroup({
    login: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  login(){
    // console.log("clicked");
    if(this.loginForm.value.login!=undefined && this.loginForm.value.password!=undefined){
      let body ={
        email : this.loginForm.value.login,
        password : this.loginForm.value.password
      };
      
      this.auth.login(body).subscribe(isLogin=>{
        if(isLogin){
          console.log("Connexion Successfull");
        }
        else{
          console.log("Cennexion failed");
        }
      })
    };
  };
}

