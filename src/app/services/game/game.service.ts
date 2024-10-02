import { Injectable } from '@angular/core';
import { TrackService } from '../track/track.service';
import { Characteristic } from '../../utils/interfaces/characteristic.interface';
import { Track } from '../../utils/interfaces/track.interface';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  collectionId: number | null = null;
  trackDuration: number = 15; 
  pauseDuration: number = 5; 
  numberOfTracks: number = 3; // Modifiez ce nombre si nécessaire

  public gameTracks: Track[] = [];
  public gameAnswers: Characteristic[][] = [];
  public currentTrackIndex: number = 0;
  userInput: string = '';
  public gameScore: number = 0; // Ajout du score
  public gameIsPaused: boolean = false; // Indicateur de pause du jeu
  public gameEnded: boolean = false; // Indicateur de fin de jeu
  public gameEnded$ = new Subject<boolean>(); // Subject pour notifier la fin du jeu
  private trackStartTime: number | null = null; //Démarrage de la track pour l'effet flamme sur answer dans composant Game

  constructor(private trackService: TrackService) {}

  setCollectionId(collectionId: number) {
    this.collectionId = collectionId;
  }

  prepareGame(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.collectionId === null) {
        return reject(new Error("Collection ID must be set before preparing the game."));
      }

      this.trackService.getTracks(this.collectionId.toString()).subscribe((tracks: Track[]) => {
        this.gameTracks = [];
        this.gameAnswers = [];

        const availableTracks = [...tracks];
        const numberOfTracks = Math.min(this.numberOfTracks, availableTracks.length);
        const selectedIndexes = new Set<number>();

        while (selectedIndexes.size < numberOfTracks) {
          const randomIndex = Math.floor(Math.random() * availableTracks.length);
          selectedIndexes.add(randomIndex);
        }

        const characteristicsPromises: Promise<void>[] = [];

        selectedIndexes.forEach((index) => {
          const selectedTrack = availableTracks[index];
          this.gameTracks.push(selectedTrack);

          const promise = new Promise<void>((res) => {
            this.trackService.getCharacteristics(selectedTrack.id).subscribe((characteristics: Characteristic[]) => {
              if (characteristics && characteristics.length > 0) {
                this.gameAnswers.push(characteristics);
              } else {
                this.gameAnswers.push([]); // Ajouter tableau vide si pas de caractéristiques
              }
              res();
            }, (err) => {
              console.error(`Error fetching characteristics for track ${selectedTrack.id}:`, err);
              this.gameAnswers.push([]); // Ajouter tableau vide en cas d'erreur
              res();
            });
          });

          characteristicsPromises.push(promise);
        });

        Promise.all(characteristicsPromises)
          .then(() => {
            console.log('Game tracks prepared:', this.gameTracks);
            resolve();
          })
          .catch(err => reject(err));
      });
    });
  }

 

  async playCurrentTrack(): Promise<void> {
    this.trackStartTime = Date.now(); // Enregistre le temps de début
    const track = this.gameTracks[this.currentTrackIndex];
    if (track) {
      console.log('Playing track:', track.url);
      await this.playAudio(track.url); // Jouer l'audio et attendre la promesse
      await this.timeBreak();
      await this.nextTrack(); // Passer à la piste suivante après que l'audio a été joué
    }
  }

  getTrackStartTime(): number | null {
    return this.trackStartTime;
  }

  async nextTrack(): Promise<void> {
    if (this.currentTrackIndex < this.gameTracks.length - 1) {
      this.currentTrackIndex++;
      await this.playCurrentTrack(); // Jouer la nouvelle piste
    } else {
      console.log('Fin du jeu');
      this.endGame(); // Appel de la méthode pour gérer la fin du jeu
    }
  }

  getCurrentAnswers(): Characteristic[] {
    return this.gameAnswers[this.currentTrackIndex] || [];
  }

  validateInput(): void {
    const currentAnswers = this.getCurrentAnswers();
    const userInputLower = this.userInput.toLowerCase();
    
    const foundCorrect = currentAnswers.some(answer => 
      answer.value && answer.value.toLowerCase() === userInputLower
    );

    if (foundCorrect) {
      currentAnswers.forEach(answer => {
        if (answer.value && answer.value.toLowerCase() === userInputLower) {
          answer.isCorrect = true; // Marquer comme correct
        }
      });
      this.playAudioFeedback('http://localhost:8090/validate.mp3'); // Jouer le son de validation
      this.gameScore++; // Incrémenter le score
    } else {
      this.playAudioFeedback('http://localhost:8090/error.mp3'); // Jouer le son d'erreur
    }

    this.userInput = ''; // Réinitialiser l'input
  }

  private playAudioFeedback(url: string): void {
    const audio = new Audio(url);
    audio.play().catch(error => {
      console.error('Error playing audio:', error);
    });
  }

  playAudio(url: string): Promise<void> {
    return new Promise((resolve) => {
      const currentAudio = new Audio(url);
      currentAudio.load();

      currentAudio.addEventListener('loadedmetadata', () => {
        const duration = currentAudio.duration;

        if (duration && duration > this.trackDuration) {
          const maxStart = duration - this.trackDuration;
          const startTime = Math.random() * maxStart;

          currentAudio.currentTime = startTime;
          currentAudio.play();

          const fadeOutStart = (this.trackDuration * 1000) - 3000;
          setTimeout(() => {
            this.fadeOutAndStop(currentAudio);
          }, fadeOutStart);



          setTimeout(() => {
            resolve(); // Résoudre la promesse après la pause
          }, (this.trackDuration) * 1000);
        } else {
          console.log("Track too short");
          resolve(); // Résoudre immédiatement pour les pistes trop courtes
        }
      });
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

  endGame(): void {
    this.gameEnded = true; // Mettre à jour l'état du jeu
    this.gameEnded$.next(true); // Émettre un événement
    console.log('Fin du jeu');
  }

  resetScore(): void {
    this.gameScore = 0; // Réinitialiser le score
    this.gameEnded = false;
  }
  private async timeBreak(): Promise<void> {
    this.userInput = ''; // Réinitialiser l'input
    this.gameIsPaused = true; // Indiquer que le jeu est en pause

    // Afficher les réponses pendant la pause
    console.log("Displaying answers...");
    const currentAnswers = this.getCurrentAnswers();
    currentAnswers.forEach(answer => {
        console.log(`${answer.name}: ${answer.value}`);
    });

    return new Promise((resolve) => {
        setTimeout(() => {
            this.gameIsPaused = false; // Réactiver l'entrée utilisateur
            resolve(); // Résoudre la promesse après la pause
        }, this.pauseDuration * 1000);
    });
  }
}
