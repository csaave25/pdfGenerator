import { TestBed } from '@angular/core/testing';

import { InformeMensualService } from './informe-mensual.service';

describe('InformeMensualService', () => {
  let service: InformeMensualService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformeMensualService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
