import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CollectionService } from '../../services/collection/collection.service'; 
import { AuthService } from '../../services/auth/auth.service'; 
import { MatDialogRef } from '@angular/material/dialog'; 
import { Collection } from '../../utils/interfaces/collection.interface';

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
  
  @Output() collectionCreated = new EventEmitter<Collection>(); // Émet un événement avec la nouvelle collection

  constructor(
    private collectionService: CollectionService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<CollectionFormComponent>
  ) {}

  onSubmit(): void {
    const userId = this.authService.getUserId(); 
  
    this.collectionService.addCollection(this.name, this.publicOption === 'yes', userId).subscribe(
      response => {
        console.log('Collection ajoutée:', response);
        this.collectionCreated.emit(response); // Émet la collection créée
        this.dialogRef.close(); // Ferme le formulaire
      },
      error => {
        console.error('Erreur lors de l\'ajout de la collection:', error);
      }
    );
  }
}
