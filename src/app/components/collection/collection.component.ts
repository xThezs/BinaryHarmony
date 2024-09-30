import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { CollectionFormComponent } from '../collection-form/collection-form.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { CollectionListComponent } from '../collection-list/collection-list.component';
import { CollectionService } from '../../services/collection/collection.service'; 
import { Collection } from '../../utils/interfaces/collection.interface';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-collection',
  standalone: true,
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css'],
  imports: [
    CommonModule,
    MatButtonModule,
    NavbarComponent,
    CollectionListComponent
  ]
})
export class CollectionComponent implements OnInit {
  collections: Collection[] = []; // Stockez les collections ici

  constructor(
    public dialog: MatDialog, 
    private collectionService: CollectionService, 
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchCollections(); // Récupérez les collections au démarrage
  }

  openCollectionForm(): void {
    const dialogRef = this.dialog.open(CollectionFormComponent, {
      width: '400px'
    });

    dialogRef.componentInstance.collectionCreated.subscribe((newCollection: Collection) => {
      console.log('Nouvelle collection:', newCollection);
      this.collections.push(newCollection); // Ajoute la nouvelle collection à la liste
      dialogRef.close(); // Ferme le formulaire
    });
  }

  fetchCollections(): void {
    const userId = this.authService.getUserId();
    this.collectionService.getCollections(userId).subscribe(
      (data) => {
        this.collections = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des collections', error);
      }
    );
  }
}
