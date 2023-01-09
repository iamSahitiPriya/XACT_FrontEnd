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


describe('AssessmentSunburstChartComponent', () => {
  let component: AssessmentSummaryComponent;
  let fixture: ComponentFixture<AssessmentSummaryComponent>;
  let mockAppService:MockAppService
  let actualData = { name:"project",children:[{
      name:"ass1",rating:3,children:[{
        name:"ass2",rating:2,children:[{
          name:"ass3",rating:3,children:[{
            name:"ass3",value:1
          }]
        }]
      }]
    }]}
  let summaryResponse:SummaryResponse ={
    categoryAssessed:1,
    moduleAssessed:1,
    topicAssessed:1,
    parameterAssessed:1,
    questionAssessed:1
  }
  class MockAppService {

    public getReportData(assessmentId:Number){
      return of(actualData)
    }
    public getSummaryData(assessmentId:number){
      return of(summaryResponse)
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentSummaryComponent ],
      imports: [ FormsModule,MatFormFieldModule,MatDividerModule,MatToolbarModule, MatButtonModule ,MatSelectModule, MatCardModule, MatIconModule,HttpClientTestingModule , RouterTestingModule, StoreModule.forRoot(reducers)],
      providers: [HttpClient, HttpHandler, FormBuilder, RouterTestingModule,
        {
          provide: AppServiceService,
          useClass: MockAppService
        },
      ]
    })

    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentSummaryComponent);
    component = fixture.componentInstance;
    mockAppService = new MockAppService()



  });
  afterEach(function() {
    d3.selectAll('svg').remove();
  });

  it('should create', () => {
    jest.spyOn(component,"getSummaryData")

    component.ngOnInit();
    expect(component).toBeTruthy();

    expect(component.getSummaryData).toHaveBeenCalled()
  });

  it('should call sunburstChart Function , click and Hover on it', function() {
    component.data =  { name:"project",children:[{
            name:"ass1",rating:3,children:[{
              name:"ass2",rating:2,children:[{
                name:"ass3",rating:3,children:[{
                  name:"This is at parameter level Assessment",value:1
                  }]
                }]
              }]
            }]}
    jest.spyOn(component, 'drawSunBurstChart');
    Object.defineProperty(global.SVGElement.prototype, 'getComputedTextLength', {
      writable: true,
      value: jest.fn().mockReturnValue(100),
    });
    component.drawSunBurstChart(component.data);
    expect(fixture.nativeElement.querySelector("svg").getAttribute("width")).toBe("100%");

    expect(fixture.nativeElement.querySelector("circle").dispatchEvent(new Event('click'))).toBe(true);


    let node = {
      data: {
        name:"ass3",rating:3,children:[{
          name:"ass3",value:1
        }]
      }
    }

    component.OnMouseOver(onmouseover,node);
    expect(d3.select("#sequence").text()).not.toBeNull();
  })

  it('should change theme of chart onClick', () =>{
    jest.spyOn(component, 'onThemeChange');
    component.selectedValue = d3.interpolatePurples;

    component.data =  { name:"project",children:[{
        name:"ass1",rating:3,children:[{
          name:"ass2",rating:2,children:[{
            name:"ass3",rating:3,children:[{
              name:"ass3",value:1
            }]
          }]
        }]
      }]}
    component.selectedValue = d3.interpolateSpectral;
    component.onThemeChange()
    expect(component.selectedValue).toBe(d3.interpolateSpectral)
  })

  it('should change theme to threat display' ,() => {
    jest.spyOn(component, 'onThemeChange');
    component.selectedValue = d3.interpolatePurples;

    component.data =  { name:"project",children:[{
        name:"ass1",rating:3,children:[{
          name:"ass2",rating:2,children:[{
            name:"ass3",rating:3,children:[{
              name:"ass3",value:1
            }]
          }]
        }]
      }]}
    component.selectedValue = 'ThreatTheme';
    component.onThemeChange()
    expect(component.selectedValue).toBe("ThreatTheme");
  })

  it('should initialize breadCrumb', () => {
    let graphContainer = document.createElement("div");
    graphContainer.id = "sequence";
    document.body.appendChild(graphContainer);
    jest.spyOn(component,'initializeBreadcrumbTrail');
    let color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow,  10).reverse());
    component.color = color
    component.initializeBreadcrumbTrail(graphContainer.id)
    expect(d3.select("#sequence").select("svg").attr("width")).toBe("100%")
  })

  it('should get Ancestors of data selected', () => {
    jest.spyOn(component, 'getAncestors');

    component.data =  { name:"project",children:[{
        name:"ass1",rating:3,children:[{
          name:"ass2",rating:2,children:[{
            name:"ass3",rating:3,children:[{
              name:"ass3",value:1
            }]
          }]
        }]
      }]}
    component.getAncestors(component.data.children[0])
    expect(component.getAncestors(component.data.children[0])).not.toBeNull();
  })

  it("should update breadCrumbs", () => {
    jest.spyOn(component,'updateSelectedAverageScore');
    let mockedNodeArray = [{
      name:"ass1",rating:3,children:[{
        name:"ass2",rating:2,children:[{
          name:"ass3",rating:3,children:[{
            name:"ass3",value:1
          }]
        }]
      }]
    }]
    component.updateSelectedAverageScore(2)
  })
  it("should fill color as green if average rating is more than 3", () => {
    jest.spyOn(component, 'fillThreatColorsInChart');

    let node = {
      data:{
        name:"ass1",rating:4
      }
    }
    expect(component.fillThreatColorsInChart(node)).toBe("green");
  })
  it("should fill color as red if average rating is less than 3", () => {
    jest.spyOn(component, 'fillThreatColorsInChart');

    let node = {
      data:{
        name:"ass1",rating:1
      }
    }
    expect(component.fillThreatColorsInChart(node)).toBe("red");
  })

  it("should fill color as orange if average rating is equal to 3", () => {
    jest.spyOn(component, 'fillThreatColorsInChart');

    let node = {
      data:{
        name:"ass1",rating:3
      }
    }
    expect(component.fillThreatColorsInChart(node)).toBe("orange");
  })


  it("should fill rating color as green if rating is more than 3", () => {
    jest.spyOn(component, 'fillRatingCircle');

    let rating =4;
    expect(component.fillRatingCircle(rating)).toBe("green");
  })

  it("should fill rating color as red if average rating is less than 3", () => {
    jest.spyOn(component, 'fillRatingCircle');

    let rating = 2
    expect(component.fillRatingCircle(rating)).toBe("red");
  })

  it("should fill rating color as orange if  rating is equal to 3", () => {
    jest.spyOn(component, 'fillRatingCircle');

    let rating = 3
    expect(component.fillRatingCircle(rating)).toBe("orange");
  })
  it("should return name of particular element of data from structure", () => {
    jest.spyOn(component, 'getDataName');
    let dummyData= {data:{
      name:"category1",rating:3
      }}
    expect(component.getDataName(dummyData)).toBe("category1")
  })
  it("should check MouseLeave Functionality", () => {
    jest.spyOn(component,'onMouseleave');
    let anyData;
    component.onMouseleave(anyData);
    expect(d3.select("#trail")).not.toBeNull();
  })

  it("should test mouseover event for parameter level rating", () => {
    jest.spyOn(component,'OnMouseOver');
    let node = {
      data: {
        name: "ass3", value: 1
      }
    }

    component.OnMouseOver(onmouseover,node);
    expect(d3.select("#sequence").text()).not.toBeNull();

  })

  it("should fetch the answers from the ngrx store", () => {
    let chartData = { name:"project",children:[{
        name:"ass1",rating:3,children:[{
          name:"ass2",rating:2,children:[{
            name:"ass3",rating:3,children:[{
              name:"ass3",value:1
            }]
          }]
        }]
      }]}
    component.getDataAndSunBurstChart();
    jest.spyOn(component,'drawSunBurstChart')
    mockAppService.getReportData(1).subscribe((data) =>{
      expect(data).toBe(chartData)
      expect(component.drawSunBurstChart).toBeCalled();
    })
  })


  it("should call download image function", () => {
    jest.spyOn(component,'downloadImage');
    const button = fixture.nativeElement.querySelector("#downloadButton");
    button.click();
    expect(component.downloadImage).toBeCalled();
  })

});
