import { Injectable } from '@angular/core';
import { TrackService } from '../track/track.service';
import { Characteristic } from '../../utils/interfaces/characteristic.interface';
import { Track } from '../../utils/interfaces/track.interface';

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
                this.gameAnswers.push(characteristics.map(characteristic => ({
                  id: characteristic.id || 0,
                  name: characteristic.name || 'Unknown',
                  value: characteristic.value || '',
                  isCorrect: false,
                  isIncorrect: false
                })));
              } else {
                this.gameAnswers.push([]);
              }
              res();
            }, (err) => {
              console.error(`Error fetching characteristics for track ${selectedTrack.id}:`, err);
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

          const fadeOutStart = (this.trackDuration * 1000) - 5000;
          setTimeout(() => {
            this.fadeOutAndStop(currentAudio);
          }, fadeOutStart);

          setTimeout(() => {
            resolve(); // Résoudre la promesse après la pause
          }, (this.trackDuration + this.pauseDuration) * 1000);
        } else {
          console.log("Track too short");
          resolve();
        }
      });
    });
  }

  private fadeOutAndStop(audio: HTMLAudioElement | null): void {
    if (!audio) return;

    const fadeOutDuration = 5000;
    const fadeOutSteps = 50;
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

  // Ajoutez une méthode qui joue la piste et passe à la suivante
  async playCurrentTrack(): Promise<void> {
    const track = this.gameTracks[this.currentTrackIndex];
    if (track) {
      console.log('Playing track:', track.url);
      await this.playAudio(track.url); // Jouer l'audio et attendre la promesse
      await this.nextTrack(); // Passer à la piste suivante après que l'audio a été joué
    }
  }

  async nextTrack(): Promise<void> {
    if (this.currentTrackIndex < this.gameTracks.length - 1) {
      this.currentTrackIndex++;
      await this.playCurrentTrack(); // Jouer la nouvelle piste
    } else {
      console.log('Fin du jeu');
      // Logique pour la fin du jeu si nécessaire
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
          answer.isCorrect = true;
        }
      });
    }
  
    this.userInput = '';
  }
}
