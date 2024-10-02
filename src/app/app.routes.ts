import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { UploadComponent } from './components/upload/upload.component';
import { CollectionFormComponent } from './components/collection-form/collection-form.component';
import { CollectionComponent } from './components/collection/collection.component';
import { ContactComponent } from './components/contact/contact.component';
import { GameComponent } from './components/game/game.component';
import { authGuard } from './services/auth/auth.guard';
import { loggedInGuard } from './services/auth/logged-in.guard';

export const routes: Routes = [
    { path: "login", component: LoginComponent, canActivate: [authGuard] },
    { path: "signup", component: SignupComponent, canActivate: [authGuard] },
    { path: "", component: HomeComponent ,canActivate:[loggedInGuard]},
    { path: "upload", component: UploadComponent, canActivate: [loggedInGuard] },
    { path: "collection", component: CollectionComponent, canActivate: [loggedInGuard] },
    { path: "contact-us", component: ContactComponent, canActivate: [loggedInGuard] },
    { path: "game", component: GameComponent, canActivate: [loggedInGuard] },
];
