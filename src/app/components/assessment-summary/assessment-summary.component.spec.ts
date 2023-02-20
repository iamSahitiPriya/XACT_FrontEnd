/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AssessmentSummaryComponent} from './assessment-summary.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../reducers/reducers";
import * as d3 from 'd3';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {of} from "rxjs";
import {MatDividerModule} from "@angular/material/divider";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {FormBuilder, FormsModule} from "@angular/forms";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {HttpClient, HttpHandler} from "@angular/common/http";
import {SummaryResponse} from "../../types/summaryResponse";
import {ElementRef} from "@angular/core";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {SunburstSequenceData} from "../../types/sunburstSequenceData";
import {SunburstSequenceTarget} from "../../types/sunburstSequenceTarget";
import {SunburstSequence} from "../../types/sunburstSequence";


describe('AssessmentSunburstChartComponent', () => {
  let component: AssessmentSummaryComponent;
  let fixture: ComponentFixture<AssessmentSummaryComponent>;
  let mockAppService: MockAppService
  let elRef: ElementRef
  let actualData = {
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
  let summaryResponse: SummaryResponse = {
    categoryAssessed: 1,
    moduleAssessed: 1,
    topicAssessed: 1,
    parameterAssessed: 1,
    questionAssessed: 1
  }

  class MockAppService {

    public getReportData(assessmentId: Number) {
      return of(actualData)
    }

    public getSummaryData(assessmentId: number) {
      return of(summaryResponse)
    }
  }

  class MockElementRef implements ElementRef {
    nativeElement = {};
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssessmentSummaryComponent],
      imports: [FormsModule, MatFormFieldModule, MatDividerModule, MatToolbarModule, NoopAnimationsModule, MatButtonModule, MatSelectModule, MatCardModule, MatIconModule, HttpClientTestingModule, MatTooltipModule, NgxChartsModule, RouterTestingModule, StoreModule.forRoot(reducers)],
      providers: [HttpClient, HttpHandler, FormBuilder, RouterTestingModule,
        {
          provide: AppServiceService,
          useClass: MockAppService
        }, {
          provide: ElementRef, useValue: new MockElementRef()
        }
      ]
    })

      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentSummaryComponent);
    component = fixture.componentInstance;
    mockAppService = new MockAppService()
    elRef = TestBed.get(ElementRef)
    component.data = {
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
    fixture.detectChanges()


  });
  afterEach(function () {
    d3.selectAll('svg').remove();
  });

  it('should create', () => {
    jest.spyOn(component, "getSummaryData")

    component.ngOnInit();
    expect(component).toBeTruthy();

    expect(component.getSummaryData).toHaveBeenCalled()
  });

  it('should call sunburstChart Function , click and Hover on it', function () {
    component.categorySummary = [{
      name: "hello", value: 2
    }]
    component.ngOnInit()
    jest.spyOn(component, 'drawSunBurstChart');
    Object.defineProperty(global.SVGElement.prototype, 'getComputedTextLength', {
      writable: true,
      value: jest.fn().mockReturnValue(100),
    });
    expect(fixture.nativeElement.querySelector("svg").getAttribute("width")).toBe("400");

    expect(fixture.nativeElement.querySelector("circle").dispatchEvent(new Event('click'))).toBe(true);


    let node = {
      data: {
        name: "ass3", rating: 3, children: [{
          name: "ass3", value: 1
        }]
      }
    }

    component.OnMouseOver(onmouseover, node);
    expect(d3.select("#sequence").text()).not.toBeNull();
  })

  it('should change theme of chart onClick', () => {
    jest.spyOn(component, 'onThemeChange');
    component.selectedValue = d3.interpolatePurples;
    component.selectedValue = d3.interpolateSpectral;
    component.onThemeChange()
    expect(component.selectedValue).toBe(d3.interpolateSpectral)
  })

  it('should change theme to threat display', () => {
    jest.spyOn(component, 'onThemeChange');
    component.selectedValue = d3.interpolatePurples;
    component.selectedValue = 'ThreatTheme';
    component.onThemeChange()
    expect(component.selectedValue).toBe("ThreatTheme");
  })

  it('should initialize breadCrumb', () => {
    let graphContainer = document.createElement("div");
    graphContainer.id = "sequence";
    document.body.appendChild(graphContainer);
    jest.spyOn(component, 'initializeBreadcrumbTrail');
    let color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, 10).reverse());
    component.color = color
    component.initializeBreadcrumbTrail(graphContainer.id)
    expect(d3.select("#sequence").select("svg").attr("width")).toBe("100%")
  })

  it('should get Ancestors of data selected', () => {
    jest.spyOn(component, 'getAncestors');

    component.getAncestors(component.data.children[0])
    expect(component.getAncestors(component.data.children[0])).not.toBeNull();
  })

  it("should update breadCrumbs", () => {
    jest.spyOn(component, 'updateSelectedAverageScore');
    let mockedNodeArray = [{
      name: "ass1", rating: 3, children: [{
        name: "ass2", rating: 2, children: [{
          name: "ass3", rating: 3, children: [{
            name: "ass3", value: 1
          }]
        }]
      }]
    }]
    component.updateSelectedAverageScore(2)
  })
  it("should fill color as green if average rating is more than 3", () => {
    jest.spyOn(component, 'fillThreatColorsInChart');

    let node = {
      data: {
        name: "ass1", rating: 4
      }
    }
    expect(component.fillThreatColorsInChart(node)).toBe("green");
  })
  it("should fill color as red if average rating is less than 3", () => {
    jest.spyOn(component, 'fillThreatColorsInChart');

    let node = {
      data: {
        name: "ass1", rating: 1
      }
    }
    expect(component.fillThreatColorsInChart(node)).toBe("red");
  })

  it("should fill color as orange if average rating is equal to 3", () => {
    jest.spyOn(component, 'fillThreatColorsInChart');

    let node = {
      data: {
        name: "ass1", rating: 3
      }
    }
    expect(component.fillThreatColorsInChart(node)).toBe("orange");
  })

  it("should return name of particular element of data from structure", () => {
    jest.spyOn(component, 'getDataName');
    let dummyData = {
      data: {
        name: "category1", rating: 3
      }
    }
    // @ts-ignore
    expect(component.getDataName(dummyData)).toBe("category1")
  })
  it("should check MouseLeave Functionality", () => {
    jest.spyOn(component, 'onMouseleave');
    let anyData;
    component.onMouseleave(anyData);
    expect(d3.select("#trail")).not.toBeNull();
  })

  it("should test mouseover event for parameter level rating", () => {
    jest.spyOn(component, 'OnMouseOver');
    let node = {
      data: {
        name: "ass3", value: 1
      }
    }

    component.OnMouseOver(onmouseover, node);
    expect(d3.select("#sequence").text()).not.toBeNull();

  })

  it("should fetch the answers from the ngrx store", () => {
    let chartData = {
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
    component.getDataAndSunBurstChart();
    jest.spyOn(component, 'drawSunBurstChart')
    mockAppService.getReportData(1).subscribe((data) => {
      expect(data).toBe(chartData)
      expect(component.drawSunBurstChart).toBeCalled();
    })
  })


  it("should call download image function", () => {
    component.categorySummary = [{
      name: "hello", value: 2
    }]
    let button = fixture.nativeElement.querySelector("#downloadButton")
    jest.spyOn(component, 'downloadImage').mockImplementation();
    button.click()
    expect(component.downloadImage).toBeCalled();
  })

});
