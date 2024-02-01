import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCMDICComponent } from './reporte-cmdic.component';

describe('ReporteCMDICComponent', () => {
  let component: ReporteCMDICComponent;
  let fixture: ComponentFixture<ReporteCMDICComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReporteCMDICComponent]
    });
    fixture = TestBed.createComponent(ReporteCMDICComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
