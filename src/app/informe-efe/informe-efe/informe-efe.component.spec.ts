import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeEfeComponent } from './informe-efe.component';

describe('InformeEfeComponent', () => {
  let component: InformeEfeComponent;
  let fixture: ComponentFixture<InformeEfeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InformeEfeComponent]
    });
    fixture = TestBed.createComponent(InformeEfeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
