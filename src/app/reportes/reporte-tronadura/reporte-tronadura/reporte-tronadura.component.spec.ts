import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteTronaduraComponent } from './reporte-tronadura.component';

describe('ReporteTronaduraComponent', () => {
  let component: ReporteTronaduraComponent;
  let fixture: ComponentFixture<ReporteTronaduraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReporteTronaduraComponent]
    });
    fixture = TestBed.createComponent(ReporteTronaduraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
