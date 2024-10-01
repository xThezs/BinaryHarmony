import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackService } from '../../services/track/track.service';
import { Track } from '../../utils/interfaces/track.interface';

@Component({
  selector: 'app-track-list',
  standalone: true,
  templateUrl: './track-list.component.html',
  styleUrls: ['./track-list.component.css'],
  imports: [CommonModule],
})
export class TrackListComponent implements OnInit {
  @Input() collectionId!: string; // Assurez-vous que l'input est défini
  public tracks: Track[] = [];

  constructor(private trackService: TrackService) {}

  ngOnInit(): void {
    this.fetchTracks();
  }

  fetchTracks(): void {
    if (this.collectionId) {
      this.trackService.getTracks(this.collectionId).subscribe(
        (data) => {
          this.tracks = data;
        },
        (error) => {
          console.error('Erreur lors de la récupération des pistes', error);
        }
      );
    }
  }
}