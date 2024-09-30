// collection-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../services/collection/collection.service';
import { AuthService } from '../../services/auth/auth.service';
import { TrackService } from '../../services/track/track.service';
import { MatDialog } from '@angular/material/dialog';
import { CollectionFormComponent } from '../collection-form/collection-form.component'; // Ajustez le chemin si nécessaire
import { Collection } from '../../utils/interfaces/collection.interface';
import { Track } from '../../utils/interfaces/track.interface'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-collection-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.css'],
})
export class CollectionListComponent implements OnInit {
  public collections: Collection[] = [];
  public tracks: Track[] = [];
  public showingTracks: boolean = false;

  constructor(
    private collectionService: CollectionService,
    private authService: AuthService,
    private trackService: TrackService,
    public dialog: MatDialog // Injection de MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchCollections();
  }

  fetchCollections(): void {
    const userId = this.authService.getUserId();
    this.collectionService.getCollections(userId).subscribe(
      (data) => {
        this.collections = data;
        this.showingTracks = false;
      },
      (error) => {
        console.error('Erreur lors de la récupération des collections', error);
      }
    );
  }

  openCollectionForm(): void {
    const dialogRef = this.dialog.open(CollectionFormComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Collection créée:', result);
        console.log(this.fetchCollections());
        this.fetchCollections(); // Re-fetch collections after creating a new one
      }
    });
  }

  openCollectionTracks(collectionId: number): void {
    this.trackService.getTracks(collectionId.toString()).subscribe(
      (data) => {
        this.tracks = data;
        this.showingTracks = true;
        this.collections = [];
      },
      (error) => {
        console.error('Erreur lors de la récupération des pistes', error);
      }
    );
  }

  returnToCollections(): void {
    this.fetchCollections();
  }
}
