import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssessmentRadarChartComponent } from './assessment-radar-chart.component';
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatCardModule} from "@angular/material/card";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {RouterTestingModule} from "@angular/router/testing";
import {ChartsModule} from "angular-bootstrap-md";

describe('AssessmentRadarChartComponent', () => {
  let component: AssessmentRadarChartComponent;
  let fixture: ComponentFixture<AssessmentRadarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentRadarChartComponent ],
      imports: [NoopAnimationsModule, MatCardModule, HttpClientTestingModule, NgxChartsModule,ChartsModule, RouterTestingModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssessmentRadarChartComponent);
    component = fixture.componentInstance;
    component.summaryData= {
      name: "project", children: [{
        name: "ass1", rating: 3, children: [{
          name: "ass2", rating: 2, children: [{
            name: "ass3", rating: 3, children: [{
              name: "ass3", value: 1
            }]
          }]
        }]
      }]
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    component.ngOnInit()
    expect(component).toBeTruthy();
  });
});
