import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CollectionService } from '../../services/collection/collection.service';
import { AuthService } from '../../services/auth/auth.service';
import { TrackService } from '../../services/track/track.service';
import { MatDialog } from '@angular/material/dialog';
import { CollectionFormComponent } from '../collection-form/collection-form.component';
import { UploadFormComponent } from '../upload-form/upload-form.component';
import { Collection } from '../../utils/interfaces/collection.interface';
import { Track } from '../../utils/interfaces/track.interface'; 
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-collection-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.css']
})
export class CollectionListComponent implements OnInit {
  public collections: Collection[] = [];
  public tracks: Track[] = [];
  public showingTracks: boolean = false;
  public collectionId: string | null = null;

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>; // Référence à l'élément audio
  public currentTrackUrl: string | null = null; // URL du morceau en cours

  constructor(
    private collectionService: CollectionService,
    private authService: AuthService,
    private trackService: TrackService,
    public dialog: MatDialog
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
        console.error('Error fetching collections', error);
      }
    );
  }

  openCollectionForm(): void {
    const dialogRef = this.dialog.open(CollectionFormComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Collection created:', result);
        this.fetchCollections(); // Re-fetch collections after creating a new one
      }
    });
  }

  openCollectionTracks(collectionId: number): void {
    this.collectionId = collectionId.toString(); // Assigner l'ID de la collection
    this.trackService.getTracks(this.collectionId).subscribe(
      (data) => {
        this.tracks = data;
        this.showingTracks = true;
        this.collections = [];
      },
      (error) => {
        console.error('Error fetching tracks', error);
      }
    );
  }

  returnToCollections(): void {
    this.fetchCollections();
  }

  deleteCollection(collectionId: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this collection?');
    if (confirmDelete) {
      this.collectionService.deleteCollection(collectionId).subscribe(
        () => {
          console.log('Collection deleted successfully');
          this.fetchCollections();
        },
        (error) => {
          console.error('Error deleting collection', error);
        }
      );
    }
  }

  openUploadForm(): void {
    const dialogRef = this.dialog.open(UploadFormComponent, {
      width: '400px'
    });
  
    // Passer l'ID de la collection au composant d'upload
    dialogRef.componentInstance.collectionIdInput = this.collectionId;
  
    dialogRef.componentInstance.trackUploaded.subscribe((newTrack) => {
      console.log('New track uploaded:', newTrack);
      this.tracks.push(newTrack); // Ajoute la nouvelle piste à la liste
    });
  }

  private currentAudio: HTMLAudioElement | null = null; // Référence à la piste audio actuelle

playAudio(url: string): void {
    // Si une piste est déjà en cours, on l'arrête
    if (this.currentAudio) {
        this.currentAudio.pause(); // Arrête la lecture
        this.currentAudio.currentTime = 0; // Réinitialise le temps de lecture
    }

    this.currentAudio = new Audio(url); // Crée une nouvelle instance d'Audio
    this.currentAudio.load(); // Charge le fichier audio

    this.currentAudio.addEventListener('loadedmetadata', () => {
        const duration = this.currentAudio?.duration; // Utilise l'opérateur de coalescence nulle

        if (duration && duration > 20 && this.currentAudio) { // Vérifie que duration n'est pas null
            const maxStart = duration - 20; // Début maximum pour jouer 15 sec
            const startTime = Math.random() * maxStart; // Position de départ aléatoire

            this.currentAudio.currentTime = startTime; // Positionne le temps de lecture
            this.currentAudio.play(); // Joue l'audio

            // Arrêter la musique après 15 secondes avec un fade out de 3 secondes
            setTimeout(() => {
                this.fadeOutAndStop(this.currentAudio);
            }, 15000);
        } else {
            this.currentAudio?.play(); // Joue la piste complète si elle fait 15 secondes ou moins
        }
    });
}

private fadeOutAndStop(audio: HTMLAudioElement | null): void {
    if (!audio) return; // Si l'audio est null, on ne fait rien

    const fadeOutDuration = 3000; // Durée du fade out en ms
    const fadeOutSteps = 30; // Nombre de pas pour le fade out
    const fadeOutInterval = fadeOutDuration / fadeOutSteps; // Durée de chaque pas

    let currentVolume = audio.volume; // Volume actuel
    const decrement = currentVolume / fadeOutSteps; // Diminution du volume à chaque pas

    const fadeOut = setInterval(() => {
        if (currentVolume > 0) {
            currentVolume = Math.max(0, currentVolume - decrement); // Diminue le volume
            audio.volume = currentVolume; // Met à jour le volume de l'audio
        } else {
            clearInterval(fadeOut); // Arrête l'intervalle
            audio.pause(); // Arrête la lecture
            audio.currentTime = 0; // Réinitialise le temps de lecture
        }
    }, fadeOutInterval);
}
}
