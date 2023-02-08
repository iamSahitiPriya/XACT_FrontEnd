import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentRadarChartComponent } from './assessment-radar-chart.component';

describe('AssessmentRadarChartComponent', () => {
  let component: AssessmentRadarChartComponent;
  let fixture: ComponentFixture<AssessmentRadarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentRadarChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssessmentRadarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
