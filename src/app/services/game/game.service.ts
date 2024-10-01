import { Injectable } from '@angular/core';
import { Collection } from '../../utils/interfaces/collection.interface';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  collectionId: number | null = null;
  trackDuration: number = 15; 
  pauseDuration: number = 5; 
  numberOfTracks: number = 1; 
  constructor() { }
  
  playAudio(url: string): void {
    const currentAudio = new Audio(url);
    currentAudio.load();

    currentAudio.addEventListener('loadedmetadata', () => {
      const duration = currentAudio?.duration;

      if (duration && duration > this.trackDuration && currentAudio) {
        const maxStart = duration - this.trackDuration;
        const startTime = Math.random() * maxStart;

        currentAudio.currentTime = startTime;
        currentAudio.play();

        setTimeout(() => {
          this.fadeOutAndStop(currentAudio);
          // play to next track
        }, this.trackDuration *1000 - 5000);
      } else {
        currentAudio?.play();
      }
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
}
