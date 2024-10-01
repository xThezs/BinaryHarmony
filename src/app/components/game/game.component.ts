import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TrackService } from '../../services/track/track.service';
import { Router } from '@angular/router';
import { Track } from '../../utils/interfaces/track.interface'; 
import { Characteristic } from '../../utils/interfaces/characteristic.interface';
import { NavbarComponent } from "../navbar/navbar.component"; 

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    NavbarComponent
],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  trackDuration: number = 15; 
  pauseDuration: number = 5; 
  numberOfTracks: number = 1; 
  collectionId: string | null = null; // Pour stocker collectionId
  collectionTracks: Track[] = []; // Pour stocker les tracks de la collection
  gameTracks: Track[] = []; // Pour stocker les tracks sélectionnés pour le jeu
  gameAnswers: Characteristic[] = []; // Pour stocker les caractéristiques des tracks
  isGameStarted: boolean = false; // État du jeu
  buttonLabel: string = 'Start Game'; // Étiquette du bouton

  constructor(private router: Router, private trackService: TrackService) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      const gameData = navigation.extras.state as { 
        collectionId: string, 
        trackDuration: number, 
        pauseDuration: number, 
        numberOfTracks: number 
      };
      this.collectionId = gameData.collectionId;
      this.trackDuration = gameData.trackDuration;
      this.pauseDuration = gameData.pauseDuration;
      this.numberOfTracks = gameData.numberOfTracks;
    }
    console.log(this.collectionId);
    // Récupérer les tracks de la collection
    if (this.collectionId) {
      this.trackService.getTracks(this.collectionId)
        .subscribe((tracks: Track[]) => {
          this.collectionTracks = tracks;
          this.prepareGameTracks();
          
        });
    }
    console.log(this.collectionTracks);
    console.log(this.gameTracks);
  }

  prepareGameTracks(): void {
    this.gameTracks = []; // Réinitialiser gameTracks à chaque appel
    const availableTracks = [...this.collectionTracks]; // Créer une copie pour éviter les doublons

    // Vérifier que le nombre de pistes demandées ne dépasse pas le nombre de pistes disponibles
    const numberOfTracks = Math.min(this.numberOfTracks, availableTracks.length);

    for (let i = 0; i < numberOfTracks; i++) {
        // Générer un index aléatoire
        const randomIndex = Math.floor(Math.random() * availableTracks.length);

        // Sélectionner la piste aléatoire
        const selectedTrack = availableTracks[randomIndex];

        // Ajouter la piste sélectionnée à gameTracks
        this.gameTracks.push({
            id: selectedTrack.id,
            title: selectedTrack.title,
            url: selectedTrack.url
        });

        // Retirer la piste sélectionnée de availableTracks pour éviter les doublons
        availableTracks.splice(randomIndex, 1);
    }

    console.log(this.gameTracks); // Pour vérifier les pistes sélectionnées
}

  prepareGameAnswers(trackId: number) {
    this.gameAnswers = []; // Réinitialiser gameAnswers à chaque appel
    this.trackService.getCharacteristics(trackId).subscribe((characteristics: Characteristic[]) => {
      this.gameAnswers = characteristics.map(characteristic => ({
        id: characteristic.id,
        name: characteristic.name,
        value: characteristic.value
      }));
    });
  }

  startStopGame() {
    this.isGameStarted = !this.isGameStarted;
    this.buttonLabel = this.isGameStarted ? 'Stop Game' : 'Start Game';
  }
}
