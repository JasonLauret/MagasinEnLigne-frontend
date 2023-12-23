import { TestBed } from '@angular/core/testing';

import { MagasinEnLigneService } from './magasin-en-ligne.service';

describe('MagasinEnLigneService', () => {
  let service: MagasinEnLigneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MagasinEnLigneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
