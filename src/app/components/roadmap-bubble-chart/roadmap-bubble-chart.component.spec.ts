import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RoadmapBubbleChartComponent} from './roadmap-bubble-chart.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {Recommendation} from "../../types/recommendation";
import {MatCardModule} from "@angular/material/card";
import {of} from "rxjs";
import * as d3 from 'd3';

class MockAppService {

  getAllRecommendations(assessmentId : number) {
    let recommendations : Recommendation[] = [
      {recommendation:"1",deliveryHorizon:"NOW",impact:"LOW",effort:"MEDIUM",categoryName:"1",updatedAt:12345},
      {recommendation:"2",deliveryHorizon:"NEXT",impact:"MEDIUM",effort:"LOW",categoryName:"2",updatedAt:12345},
      {recommendation:"3",deliveryHorizon:"LATER",impact:"HIGH",effort:"HIGH",categoryName:"",updatedAt:12345}]
    return of(recommendations);
  }
}
describe('RoadmapBubbleChartComponent', () => {
  let component: RoadmapBubbleChartComponent;
  let fixture: ComponentFixture<RoadmapBubbleChartComponent>;
  let mockAppService : MockAppService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoadmapBubbleChartComponent ],
      imports : [HttpClientTestingModule, MatCardModule],
      providers : [{provide: AppServiceService, useClass: MockAppService}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadmapBubbleChartComponent);
    component = fixture.componentInstance;
    mockAppService = new MockAppService()
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should get all the recommendations", () => {
    component.ngOnInit()
    component.assessmentId = 1

    component.getRecommendations()

    expect(component.recommendationResponse.length).toBe(3)
    })

  it("should return empty label for chart ticks", () => {

    expect(component.tickFormat()).toBe("")
  });

});
