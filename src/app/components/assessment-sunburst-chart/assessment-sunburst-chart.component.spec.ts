import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AssessmentSunburstChartComponent} from './assessment-sunburst-chart.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../reducers/reducers";
import * as d3 from 'd3';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {of} from "rxjs";


describe('AssessmentSunburstChartComponent', () => {
  let component: AssessmentSunburstChartComponent;
  let fixture: ComponentFixture<AssessmentSunburstChartComponent>;
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
  class MockAppService {
    public getReportData(assessmentId:Number){
      return of(actualData)
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentSunburstChartComponent ],
      imports: [ MatFormFieldModule, MatSelectModule, MatIconModule,HttpClientTestingModule , RouterTestingModule, StoreModule.forRoot(reducers)]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentSunburstChartComponent);
    component = fixture.componentInstance;
    mockAppService = new MockAppService()



  });
  afterEach(function() {
    d3.selectAll('svg').remove();
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should call sunburstChart Function and Hover on it', function() {
    component.data =  { name:"project",children:[{
            name:"ass1",rating:3,children:[{
              name:"ass2",rating:2,children:[{
                name:"ass3",rating:3,children:[{
                  name:"ass3",value:1
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
    jest.spyOn(component, 'onClick');

    component.data =  { name:"project",children:[{
        name:"ass1",rating:3,children:[{
          name:"ass2",rating:2,children:[{
            name:"ass3",rating:3,children:[{
              name:"ass3",value:1
            }]
          }]
        }]
      }]}
    component.selectedValue = d3.interpolatePurples;
    component.onClick(d3.interpolateSpectral)
    expect(component.selectedValue).toBe(d3.interpolateSpectral)
  })

  it('should change theme to threat display' ,() => {
    jest.spyOn(component, 'onClick');

    component.data =  { name:"project",children:[{
        name:"ass1",rating:3,children:[{
          name:"ass2",rating:2,children:[{
            name:"ass3",rating:3,children:[{
              name:"ass3",value:1
            }]
          }]
        }]
      }]}
    component.selectedValue = d3.interpolatePurples;
    component.onClick(null)
    expect(component.selectedValue).toBe(null);
  })

  it('should initialize breadCrumb', () => {
    let graphContainer = document.createElement("div");
    graphContainer.id = "sequence";
    document.body.appendChild(graphContainer);
    jest.spyOn(component,'initializeBreadcrumbTrail');
    let color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow,  10).reverse());
    component.initializeBreadcrumbTrail(graphContainer.id,color)
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
  it('should be able to create figure of breadCrumbs', () => {
    jest.spyOn(component, 'breadcrumbFigure');

    component.data =  { name:"project",children:[{
        name:"ass1",rating:3,children:[{
          name:"ass2",rating:2,children:[{
            name:"ass3",rating:3,children:[{
              name:"ass3",value:1
            }]
          }]
        }]
      }]}
    var actualFigurePoints = component.breadcrumbFigure(component.data.children[0],2);
    var expectedFigurePoints = "0,0 155,26.666666666666668 310,0 310,80 155,120 0,80";
    expect(actualFigurePoints).toBe(expectedFigurePoints)

  })
  it("should update breadCrumbs", () => {
    jest.spyOn(component,'updateBreadcrumbs');
    let mockedNodeArray = [{
      name:"ass1",rating:3,children:[{
        name:"ass2",rating:2,children:[{
          name:"ass3",rating:3,children:[{
            name:"ass3",value:1
          }]
        }]
      }]
    }]
    component.updateBreadcrumbs(mockedNodeArray,2)
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

  it("should be able to change position of upcoming breadCrumbs" , () => {
    jest.spyOn(component,'getBreadCrumbTranslation');
    let dummyData1 = {
      name:"category", depth:2
    }
    expect(component.getBreadCrumbTranslation(dummyData1)).toBe("translate(0,210)")
    let dummyData2 = {
      name:"category", depth:3
    }
    expect(component.getBreadCrumbTranslation(dummyData2)).toBe("translate(0,315)")

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
    let expectedData = { name:"project",children:[{
        name:"ass1",rating:3,children:[{
          name:"ass2",rating:2,children:[{
            name:"ass3",rating:3,children:[{
              name:"ass3",value:1
            }]
          }]
        }]
      }]}
    mockAppService.getReportData(1).subscribe(data =>{
      expect(data).toBe(expectedData)
    })
  })


});
