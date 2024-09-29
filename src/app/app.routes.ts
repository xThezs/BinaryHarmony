import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { UploadComponent } from './components/upload/upload.component';
import { CollectionFormComponent } from './components/collection-form/collection-form.component';
import { CollectionComponent } from './components/collection/collection.component';
import { ContactComponent } from './components/contact/contact.component';

export const routes: Routes = [
    {path : "login",component:LoginComponent},
    {path : "signup",component:SignupComponent},
    {path : "",component:HomeComponent},
    {path : "upload",component:UploadComponent},
    {path : "collection",component:CollectionComponent},
    {path : "contact-us",component:ContactComponent},
];
