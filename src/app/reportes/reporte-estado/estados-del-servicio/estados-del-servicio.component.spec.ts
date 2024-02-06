import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadosDelServicioComponent } from './estados-del-servicio.component';

describe('EstadosDelServicioComponent', () => {
  let component: EstadosDelServicioComponent;
  let fixture: ComponentFixture<EstadosDelServicioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstadosDelServicioComponent]
    });
    fixture = TestBed.createComponent(EstadosDelServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
