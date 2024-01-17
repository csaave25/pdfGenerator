import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteSismosComponent } from './reporte-sismos.component';

describe('ReporteSismosComponent', () => {
  let component: ReporteSismosComponent;
  let fixture: ComponentFixture<ReporteSismosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReporteSismosComponent]
    });
    fixture = TestBed.createComponent(ReporteSismosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
