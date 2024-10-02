import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component'; // Assurez-vous que votre Navbar est également un standalone
import { ChatComponent } from '../chat/chat.component'; // Importez le ChatComponent

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, ChatComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {}
