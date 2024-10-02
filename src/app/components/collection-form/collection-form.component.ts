import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CollectionService } from '../../services/collection/collection.service'; 
import { AuthService } from '../../services/auth/auth.service'; 
import { MatDialogRef } from '@angular/material/dialog'; 
import { Collection } from '../../utils/interfaces/collection.interface';
import { CollectionComponent } from '../collection/collection.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-collection-form',
  standalone: true,
  imports: [FormsModule, CommonModule,MatIconModule],
  templateUrl: './collection-form.component.html',
  styleUrls: ['./collection-form.component.css'],
})
export class CollectionFormComponent {
  name: string = '';
  publicOption: string = 'no';
  
  @Output() collectionCreated = new EventEmitter<Collection>(); // Émet un événement avec la collection créée

  constructor(
    private collectionService: CollectionService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<CollectionFormComponent>
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    const userId = this.authService.getUserId(); 

    this.collectionService.addCollection(this.name, this.publicOption === 'yes', userId).subscribe(
      response => {
        console.log('Collection ajoutée:', response);
        this.collectionCreated.emit(response); // Émet l'événement avec la collection ajoutée
        location.reload();
        this.dialogRef.close(); // Ferme le formulaire ici
      },
      error => {
        console.error('Erreur lors de l\'ajout de la collection:', error);
      }
    );
  }
}
