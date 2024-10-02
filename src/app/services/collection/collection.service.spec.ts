import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CollectionService } from './collection.service';
import { Collection } from '../../utils/interfaces/collection.interface';

describe('CollectionService', () => {
  let service: CollectionService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Importer le module pour les tests
    });
    service = TestBed.inject(CollectionService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Vérifiez qu'il n'y a pas de requêtes en attente
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });



  it('should delete a collection', () => {
    const collectionId = 1;

    service.deleteCollection(collectionId).subscribe(response => {
      expect(response).toBeUndefined(); // Vérifiez que la réponse est undefined
    });

    const req = httpTestingController.expectOne(`http://localhost:3030/collections/${collectionId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({}); // Simulez la réponse de l'API
  });

  // Ajoutez d'autres tests pour les méthodes supplémentaires...
});
