import { TestBed } from '@angular/core/testing';

import { GeneradorService } from './generador.service';

describe('GeneradorService', () => {
  let service: GeneradorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneradorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
