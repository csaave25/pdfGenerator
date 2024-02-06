import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnosDiariosComponent } from './turnos-diarios.component';

describe('TurnosDiariosComponent', () => {
  let component: TurnosDiariosComponent;
  let fixture: ComponentFixture<TurnosDiariosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TurnosDiariosComponent]
    });
    fixture = TestBed.createComponent(TurnosDiariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
