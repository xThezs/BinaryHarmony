import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule, 
    MatSelectModule,
    RouterModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  private auth=inject(AuthService);
  signupForm = new FormGroup <any>({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmpassword: new FormControl('', [Validators.required]),
  });
  signup(){
      let body ={
        email : this.signupForm.value.email,
        name : this.signupForm.value.name,
        password : this.signupForm.value.password,
        confirmpassword : this.signupForm.value.confirmpassword,
      };
      if(this.signupForm.value.password==this.signupForm.value.confirmpassword){
        this.auth.signup(body);
      }
      else{
        console.log("Password don't match")
      }
      
      
  };
}

