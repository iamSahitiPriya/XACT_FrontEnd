/*
 *  Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AssessmentRadarChartComponent} from './assessment-radar-chart.component';
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatCardModule} from "@angular/material/card";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {ChartsModule} from "angular-bootstrap-md";
import {AssessmentSummaryComponent} from "../../assessment-summary/assessment-summary.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

describe('AssessmentRadarChartComponent', () => {
  let component: AssessmentRadarChartComponent;
  let fixture: ComponentFixture<AssessmentRadarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssessmentRadarChartComponent, AssessmentSummaryComponent],
      imports: [NoopAnimationsModule, MatCardModule, HttpClientTestingModule, NgxChartsModule ,ChartsModule, RouterTestingModule, MatTooltipModule, MatIconModule,
      FormsModule],
      schemas:[CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AssessmentRadarChartComponent);
    component = fixture.componentInstance;
    component.summaryData = {
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
  });

  it('should create', () => {
    component.ngOnInit()
    expect(component).toBeTruthy();
  });

  it("should get a formatted label", () => {
    let label = "Radar Chart Label"
    expect(component.getFormattedLabel(label)).toBe("Radar Chart Lab...");

  });
});
