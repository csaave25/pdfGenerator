import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeA2mgComponent } from './informe-a2mg.component';

describe('InformeA2mgComponent', () => {
  let component: InformeA2mgComponent;
  let fixture: ComponentFixture<InformeA2mgComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InformeA2mgComponent]
    });
    fixture = TestBed.createComponent(InformeA2mgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
