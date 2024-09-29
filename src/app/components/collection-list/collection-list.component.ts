import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionService } from '../../services/collection/collection.service'; // Assurez-vous que ce chemin est correct

@Component({
  selector: 'app-collection-list',
  standalone: true,
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.css'],
  imports: [CommonModule], // Importer CommonModule pour l'utilisation des directives Angular
})
export class CollectionListComponent implements OnInit {
  collections: any[] = []; // Remplacez 'any' par votre type de données spécifique

  constructor(private collectionService: CollectionService) {}

  ngOnInit(): void {
    this.fetchCollections(); // Appeler la méthode pour récupérer les collections au démarrage
  }

  fetchCollections(): void {
   
    const userId = '1'; // Get user id
    this.collectionService.getCollections(userId).subscribe(
      (data) => {
        this.collections = data; // Mettez à jour la liste des collections
      },
      (error) => {
        console.error('Erreur lors de la récupération des collections', error);
      }
    );
  }
}