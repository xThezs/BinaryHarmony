import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from '../navbar/navbar.component';
import { CollectionListComponent } from '../collection-list/collection-list.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule,
    MatButtonModule,
    NavbarComponent,
    CollectionListComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {

}
