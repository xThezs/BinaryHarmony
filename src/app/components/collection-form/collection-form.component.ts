import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CollectionService } from '../../services/collection/collection.service'; // Importez le service ici
import { AuthService } from '../../services/auth/auth.service'; // Importez votre service d'authentification

@Component({
  selector: 'app-collection-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './collection-form.component.html',
  styleUrls: ['./collection-form.component.css'],
})
export class CollectionFormComponent {
  name: string = '';
  publicOption: string = 'no';

  constructor(private collectionService: CollectionService, private authService: AuthService) {}

  onSubmit(): void {
    const userId = this.authService.getUserId(); 
    console.log(this.authService.getUserId());

    this.collectionService.addCollection(this.name, this.publicOption === 'yes', userId).subscribe(
      response => {
        console.log('Collection ajoutée:', response);
      },
      error => {
        console.error('Erreur lors de l\'ajout de la collection:', error);
      }
    );
  }
}