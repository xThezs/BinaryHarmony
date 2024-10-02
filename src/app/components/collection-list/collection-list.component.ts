import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { CollectionService } from '../../services/collection/collection.service';
import { AuthService } from '../../services/auth/auth.service';
import { TrackService } from '../../services/track/track.service';
import { MatDialog } from '@angular/material/dialog';
import { CollectionFormComponent } from '../collection-form/collection-form.component';
import { UploadFormComponent } from '../upload-form/upload-form.component';
import { AnswerFormComponent } from '../answer-form/answer-form.component'; // Import du nouveau composant
import { Collection } from '../../utils/interfaces/collection.interface';
import { Track } from '../../utils/interfaces/track.interface'; 
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { SetupFormComponent } from '../setup-form/setup-form.component';
import { GameService } from '../../services/game/game.service';

@Component({
  selector: 'app-collection-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, AnswerFormComponent],
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.css']
})
export class CollectionListComponent implements OnInit {
  public gameService = inject(GameService);

  public collections: Collection[] = [];
  public tracks: Track[] = [];
  public showingTracks: boolean = false;
  public collectionId: string | null = null;
  public selectedTrackId: number | null = null;
  public showEditForm: boolean = false;

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  public currentTrackUrl: string | null = null;

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

  fetchTracks(): void {
    if (this.collectionId) {
      this.trackService.getTracks(this.collectionId).subscribe(
        (data) => {
          this.tracks = data;
        },
        (error) => {
          console.error('Error fetching tracks', error);
        }
      );
    }
  }

  openCollectionForm(): void {
    const dialogRef = this.dialog.open(CollectionFormComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Collection created:', result);
        this.fetchCollections();
      }
    });
  }

  openCollectionTracks(collectionId: number): void {
    this.collectionId = collectionId.toString();
    this.gameService.collectionId = collectionId;
    this.fetchTracks();
    this.showingTracks = true;
    this.collections = [];
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

    dialogRef.componentInstance.collectionIdInput = this.collectionId;

    dialogRef.componentInstance.trackUploaded.subscribe((newTrack) => {
      console.log('New track uploaded:', newTrack);
      this.tracks.push(newTrack);
    });
  }

  openAnswerForm(trackId: number): void {
    console.log('Opening AnswerForm with Track ID:', trackId); // Ajouté
    const dialogRef = this.dialog.open(AnswerFormComponent, {
      width: '400px',
      data: { trackId } // Passer trackId dans les données
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchTracks(); // Mettre à jour la liste des pistes après fermeture
      }
    });
  }

  openSetupForm(): void {
    const dialogRef = this.dialog.open(SetupFormComponent, {
      width: '400px',
      data: { collectionId: this.collectionId } // Passer le collectionId ici
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Setup form closed with result:', result);
      }
    });
  }

  private currentAudio: HTMLAudioElement | null = null;

  playAudio(url: string): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }

    this.currentAudio = new Audio(url);
    this.currentAudio.load();

    this.currentAudio.addEventListener('loadedmetadata', () => {
      const duration = this.currentAudio?.duration;

      if (duration && duration > 20 && this.currentAudio) {
        const maxStart = duration - 20;
        const startTime = Math.random() * maxStart;

        this.currentAudio.currentTime = startTime;
        this.currentAudio.play();

        setTimeout(() => {
          this.fadeOutAndStop(this.currentAudio);
        }, 15000);
      } else {
        this.currentAudio?.play();
      }
    });
  }

  private fadeOutAndStop(audio: HTMLAudioElement | null): void {
    if (!audio) return;

    const fadeOutDuration = 3000;
    const fadeOutSteps = 30;
    const fadeOutInterval = fadeOutDuration / fadeOutSteps;

    let currentVolume = audio.volume;
    const decrement = currentVolume / fadeOutSteps;

    const fadeOut = setInterval(() => {
      if (currentVolume > 0) {
        currentVolume = Math.max(0, currentVolume - decrement);
        audio.volume = currentVolume;
      } else {
        clearInterval(fadeOut);
        audio.pause();
        audio.currentTime = 0;
      }
    }, fadeOutInterval);
  }
  deleteTrack(trackId: number, collectionId: string | null): void {
    if (!collectionId) {
        console.error('Collection ID is required to delete a track.');
        return;
    }

    // Vérifier le nombre de pistes restantes
    this.trackService.getTracks(collectionId).subscribe(
        (tracks) => {
            if (tracks.length <= 1) {
                alert('At least one track must remain in the collection.');
                return;
            }

            const confirmDelete = confirm('Are you sure you want to delete this track?');
            if (confirmDelete) {
                this.trackService.deleteTrack(trackId, collectionId).subscribe(
                    () => {
                        console.log('Track deleted successfully');
                        this.fetchTracks(); // Met à jour la liste des pistes après la suppression
                    },
                    (error) => {
                        console.error('Error deleting track', error);
                        alert('An error occurred while deleting the track. Please try again.'); // Alert pour informer l'utilisateur
                    }
                );
            }
        },
        (error) => {
            console.error('Error fetching tracks', error);
            alert('An error occurred while fetching tracks. Please try again.'); // Gérer l'erreur lors de la récupération des pistes
        }
    );
}

  
}
