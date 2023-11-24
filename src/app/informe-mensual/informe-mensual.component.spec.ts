import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeMensualComponent } from './informe-mensual.component';

describe('InformeMensualComponent', () => {
  let component: InformeMensualComponent;
  let fixture: ComponentFixture<InformeMensualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InformeMensualComponent]
    });
    fixture = TestBed.createComponent(InformeMensualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
