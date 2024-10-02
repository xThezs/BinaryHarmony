import { Component, inject, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TrackService } from '../../services/track/track.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GameService } from '../../services/game/game.service';

@Component({
  selector: 'app-setup-form',
  standalone: true,
  imports:[MatInputModule,MatFormFieldModule,MatIconModule,CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './setup-form.component.html',
  styleUrls: ['./setup-form.component.css']
})
export class SetupFormComponent implements OnInit {
  collectionId: string | null;
  trackDuration: number = 20; 
  pauseDuration: number = 6; 
  numberOfTracks: number = 1; 
  totalTracks: number = 0; 

  public dialogRef = inject(MatDialogRef<SetupFormComponent>);
  public data = inject(MAT_DIALOG_DATA);
  private trackService = inject(TrackService);
  private router = inject(Router);
  private gameService = inject(GameService);

  constructor() {
    this.collectionId = this.data.collectionId; 
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
    return Math.max(20, Math.min(45, value));
  }

  validatePauseDuration(value: number): number {
    return Math.max(6, Math.min(20, value));
  }

  validateNumberOfTracks(value: number): number {
    return Math.max(1, Math.min(this.totalTracks, value));
  }

  startGame(): void {
    this.gameService.trackDuration = this.trackDuration;
    this.gameService.pauseDuration = this.pauseDuration;
    this.gameService.numberOfTracks = this.numberOfTracks;

    this.dialogRef.close(); 
    this.router.navigate(['/game']);
  }

  close(): void {
    this.dialogRef.close();
  }
}
