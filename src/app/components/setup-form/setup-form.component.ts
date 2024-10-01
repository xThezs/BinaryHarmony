import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TrackService } from '../../services/track/track.service';
import { Router } from '@angular/router'; // Importer le Router
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-setup-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './setup-form.component.html',
  styleUrls: ['./setup-form.component.css']
})
export class SetupFormComponent implements OnInit {
  collectionId: string | null;
  trackDuration: number = 15; 
  pauseDuration: number = 5; 
  numberOfTracks: number = 1; 
  totalTracks: number = 0; 

  constructor(
    public dialogRef: MatDialogRef<SetupFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private trackService: TrackService,
    private router: Router // Injecter le Router
  ) {
    this.collectionId = data.collectionId; 
  }

  ngOnInit(): void {
    this.fetchTracksCount(); 
    console.log(this.collectionId);
  }

  fetchTracksCount(): void {
    this.trackService.getTracks(this.collectionId!).subscribe(tracks => {
      this.totalTracks = Math.min(tracks.length, 50); // Limiter à 50
    });
  }

  validateTrackDuration(value: number): number {
    return Math.max(15, Math.min(30, value));
  }

  validatePauseDuration(value: number): number {
    return Math.max(5, Math.min(20, value));
  }

  validateNumberOfTracks(value: number): number {
    return Math.max(1, Math.min(this.totalTracks, value));
  }

  startGame(): void {
    const gameData = {
      collectionId: this.collectionId, // Inclure collectionId dans les données
      trackDuration: this.trackDuration,
      pauseDuration: this.pauseDuration,
      numberOfTracks: this.numberOfTracks
    };
    
    // Fermer le dialogue et passer les données
    this.dialogRef.close(gameData); 
   
    // Naviguer vers le composant Game avec l'état
    this.router.navigate(['/game'], { state: gameData });
  }

  close(): void {
    this.dialogRef.close();
  }
}
