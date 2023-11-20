import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPDFComponent } from './new-pdf.component';

describe('NewPDFComponent', () => {
  let component: NewPDFComponent;
  let fixture: ComponentFixture<NewPDFComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewPDFComponent]
    });
    fixture = TestBed.createComponent(NewPDFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
