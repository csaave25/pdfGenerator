import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfTemplateComponent } from './pdf-template.component';

describe('PdfTemplateComponent', () => {
  let component: PdfTemplateComponent;
  let fixture: ComponentFixture<PdfTemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PdfTemplateComponent]
    });
    fixture = TestBed.createComponent(PdfTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
