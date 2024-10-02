import { TestBed } from '@angular/core/testing';
import { GameService } from './game.service';
import { TrackService } from '../track/track.service';
import { of, throwError } from 'rxjs';
import { Track } from '../../utils/interfaces/track.interface';
import { Characteristic } from '../../utils/interfaces/characteristic.interface';

describe('GameService', () => {
  let service: GameService;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('TrackService', ['getTracks', 'getCharacteristics']);
    TestBed.configureTestingModule({
      providers: [
        GameService,
        { provide: TrackService, useValue: spy }
      ]
    });
    service = TestBed.inject(GameService);
    trackServiceSpy = TestBed.inject(TrackService) as jasmine.SpyObj<TrackService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setCollectionId', () => {
    it('should set collectionId', () => {
      service.setCollectionId(1);
      expect(service.collectionId).toBe(1);
    });
  });

  describe('prepareGame', () => {
    it('should reject if collectionId is null', (done) => {
      service.prepareGame().catch((error) => {
        expect(error.message).toBe("Collection ID must be set before preparing the game.");
        done();
      });
    });

    it('should prepare the game and fetch tracks and characteristics', (done) => {
      const mockTracks: Track[] = [
        { id: 1, title: 'Track 1', url: 'track1.mp3' },
        { id: 2, title: 'Track 2', url: 'track2.mp3' },
        { id: 3, title: 'Track 3', url: 'track3.mp3' }
      ];
      
      trackServiceSpy.getTracks.and.returnValue(of(mockTracks));
      trackServiceSpy.getCharacteristics.and.returnValue(of([{ id: 1, name: 'Characteristic 1', value: 'Value 1' }]));

      service.setCollectionId(1);
      service.prepareGame().then(() => {
        expect(service.gameTracks.length).toBe(3);
        expect(service.gameAnswers.length).toBe(3);
        done();
      });
    });

    it('should handle errors when fetching characteristics', (done) => {
      const mockTracks: Track[] = [{ id: 1, title: 'Track 1', url: 'track1.mp3' }];
      trackServiceSpy.getTracks.and.returnValue(of(mockTracks));
      trackServiceSpy.getCharacteristics.and.returnValue(throwError('Error'));

      service.setCollectionId(1);
      service.prepareGame().then(() => {
        expect(service.gameTracks.length).toBe(1);
        expect(service.gameAnswers.length).toBe(1); // Vérifie que gameAnswers a un tableau
        expect(service.gameAnswers[0]).toEqual([]); // Assurez-vous que le tableau est vide
        done();
      });
    });
  });


  describe('nextTrack', () => {
    it('should play the next track', async () => {
      service.gameTracks = [
        { id: 1, title: 'Track 1', url: 'track1.mp3' },
        { id: 2, title: 'Track 2', url: 'track2.mp3' }
      ];
      service.currentTrackIndex = 0;

      spyOn(service, 'playCurrentTrack').and.returnValue(Promise.resolve());

      await service.nextTrack();
      expect(service.currentTrackIndex).toBe(1);
      expect(service.playCurrentTrack).toHaveBeenCalled();
    });

    it('should end the game if no more tracks', async () => {
      service.gameTracks = [{ id: 1, title: 'Track 1', url: 'track1.mp3' }];
      service.currentTrackIndex = 0;

      spyOn(service, 'endGame');

      await service.nextTrack();
      expect(service.endGame).toHaveBeenCalled();
    });
  });

  describe('validateInput', () => {
    beforeEach(() => {
      service.userInput = 'Value 1';
      service.gameAnswers = [[{ id: 1, name: 'Characteristic 1', value: 'Value 1', isCorrect: false, isIncorrect: false }]];
    });

    it('should mark answer as correct and increase score', () => {
      service.validateInput();
      expect(service.gameAnswers[0][0].isCorrect).toBeTrue();
      expect(service.gameScore).toBe(1);
    });

    it('should not mark answer as correct if input is wrong', () => {
      service.userInput = 'Wrong Value';
      service.validateInput();
      expect(service.gameAnswers[0][0].isCorrect).toBeFalse();
      expect(service.gameScore).toBe(0);
    });
  });

  describe('endGame', () => {
    it('should set gameEnded to true and notify', (done) => {
      service.gameEnded$.subscribe((ended) => {
        expect(ended).toBeTrue();
        done();
      });
  
      service.endGame(); // Appel à la méthode à tester
    });
  });

  describe('resetScore', () => {
    it('should reset score and gameEnded', () => {
      service.gameScore = 5;
      service.gameEnded = true;
      service.resetScore();
      expect(service.gameScore).toBe(0);
      expect(service.gameEnded).toBeFalse();
    });
  });
});
