import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertasDeSeguridadComponent } from './alertas-de-seguridad.component';

describe('AlertasDeSeguridadComponent', () => {
  let component: AlertasDeSeguridadComponent;
  let fixture: ComponentFixture<AlertasDeSeguridadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlertasDeSeguridadComponent]
    });
    fixture = TestBed.createComponent(AlertasDeSeguridadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
