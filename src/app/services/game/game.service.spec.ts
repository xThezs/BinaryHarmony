import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { GameService } from './game.service';
import { TrackService } from '../track/track.service';
import { Track } from '../../utils/interfaces/track.interface';
import { Characteristic } from '../../utils/interfaces/characteristic.interface';

describe('GameService', () => {
  let service: GameService;
  let trackServiceMock: jasmine.SpyObj<TrackService>;

  beforeEach(() => {
    trackServiceMock = jasmine.createSpyObj('TrackService', ['getTracks', 'getCharacteristics']);
    TestBed.configureTestingModule({
      providers: [
        GameService,
        { provide: TrackService, useValue: trackServiceMock }
      ]
    });
    service = TestBed.inject(GameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should prepare the game with tracks', (done) => {
    const mockTracks: Track[] = [
      { id: 1, title: 'Track 1', url: 'track1.mp3' },
      { id: 2, title: 'Track 2', url: 'track2.mp3' },
      { id: 3, title: 'Track 3', url: 'track3.mp3' }
    ];
    
    // Prototype of the getTracks method to return mockTracks
    trackServiceMock.getTracks.and.returnValue(of(mockTracks));
    
    // Prototype of the getCharacteristics method to return characteristics for each track
    trackServiceMock.getCharacteristics.and.callFake((trackId) => {
      return of([{ id: 1, name: 'Characteristic 1', value: 'Value 1' }]);
    });

    service.setCollectionId(1);

    service.prepareGame().then(() => {
      expect(service.gameTracks.length).toBeLessThanOrEqual(mockTracks.length);
      expect(service.gameAnswers.length).toBe(service.gameTracks.length);
      done();
    });
  });

  it('should validate input correctly', () => {
    const mockTracks: Track[] = [
      { id: 1, title: 'Track 1', url: 'track1.mp3' }
    ];

    service.gameTracks = mockTracks;
    service.gameAnswers = [[{ id: 1, name: 'Characteristic 1', value: 'Value 1' }]];
    
    service.userInput = 'Value 1';
    service.validateInput();

    expect(service.gameScore).toBe(1); // Score should increment
    expect(service.gameAnswers[0][0].isCorrect).toBeTrue(); // First answer should be marked correct
  });

  it('should end the game correctly', () => {
    service.endGame();
    expect(service.gameEnded).toBeTrue();
  });

  it('should reset the score correctly', () => {
    service.gameScore = 5;
    service.resetScore();
    expect(service.gameScore).toBe(0);
    expect(service.gameEnded).toBeFalse();
  });
});
