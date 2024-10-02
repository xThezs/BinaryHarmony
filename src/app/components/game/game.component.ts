import { CommonModule } from '@angular/common'; 
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Track } from '../../utils/interfaces/track.interface'; 
import { Characteristic } from '../../utils/interfaces/characteristic.interface';
import { NavbarComponent } from "../navbar/navbar.component"; 
import { GameService } from '../../services/game/game.service';
import { TrackService } from '../../services/track/track.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    NavbarComponent,
    FormsModule
  ],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  isGameStarted: boolean = false; 
  userInput: string = ''; 
  collectionTracks: Track[] = []; 
  placeholder: string = 'Enter your answer and press enter to validate';
  showEndGameDialog: boolean = false; // Contrôle l'affichage de la fenêtre de fin de jeu

  constructor(private router: Router, private trackService: TrackService, public gameService: GameService) {}

  ngOnInit() {
    const collectionId = this.gameService.collectionId;
    if (collectionId) {
      this.trackService.getTracks(collectionId.toString()).subscribe((tracks: Track[]) => {
        this.collectionTracks = tracks;

        this.gameService.prepareGame().then(() => {
          console.log('Game tracks:', this.gameService.gameTracks);
          console.log('Game answers:', this.gameService.gameAnswers);
        }).catch(error => {
          console.error('Error preparing game:', error);
        });
      });
    }

    // Abonnez-vous à l'événement de fin de jeu
    this.gameService.gameEnded$.subscribe(() => {
      this.endGame(); // Appeler la méthode pour afficher la fenêtre
    });
  }

  async startGame() {
    this.isGameStarted = true; // Démarrer le jeu
    this.showEndGameDialog = false; // Réinitialiser l'état de la fenêtre de fin de jeu
    this.gameService.gameEnded = false; // Réinitialiser l'état de fin de jeu
    await this.gameService.prepareGame();
    await this.gameService.playCurrentTrack(); // Jouer la première piste ici
  }

  get currentAnswers(): Characteristic[] {
    return this.gameService.getCurrentAnswers();
  }

  validateAnswer() {
    this.gameService.validateInput(); 
    const hasCorrectAnswers = this.currentAnswers.some(answer => answer.isCorrect);

    if (hasCorrectAnswers) {
        this.placeholder = 'Enter your answer and press enter to validate'; 
    } else {
        this.placeholder = 'Try Again'; 
    }
  }

  endGame() {
    this.showEndGameDialog = true; // Afficher la fenêtre de fin de jeu
  }

  playAgain() {
    this.gameService.resetScore(); // Réinitialiser le score
    this.isGameStarted = false; // Revenir à l'état initial
    this.showEndGameDialog = false; // Réinitialiser la fenêtre de fin de jeu
  }

  chooseAnotherCollection() {
    this.router.navigate(['/collection']); // Rediriger vers la page de collection
  }
}
