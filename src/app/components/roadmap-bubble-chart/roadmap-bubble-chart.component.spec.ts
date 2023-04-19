import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RoadmapBubbleChartComponent} from './roadmap-bubble-chart.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {Recommendation} from "../../types/recommendation";
import {MatCardModule} from "@angular/material/card";
import {of} from "rxjs";
import {MatIconModule} from "@angular/material/icon";
import {AssessmentSummaryComponent} from "../assessment-summary/assessment-summary.component";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {MatTooltipModule} from "@angular/material/tooltip";

class MockAppService {

  getAllRecommendations(assessmentId: number) {
    let recommendations: Recommendation[] = [
      {
        recommendationId: 1,
        recommendation: "1",
        deliveryHorizon: "NOW",
        impact: "LOW",
        effort: "MEDIUM",
        categoryName: "1",
        updatedAt: 12345,
        category: 1,
        module: 1,
        topic: 1
      },
      {
        recommendationId: 2,
        recommendation: "2",
        deliveryHorizon: "NEXT",
        impact: "MEDIUM",
        effort: "LOW",
        categoryName: "2",
        updatedAt: 12345,
        category: 1,
        module: 1,
        topic: 1
      },
      {
        recommendationId: 3,
        recommendation: "3",
        deliveryHorizon: "LATER",
        impact: "HIGH",
        effort: "HIGH",
        categoryName: "",
        updatedAt: 12345,
        category: 1,
        module: 1,
        topic: 1
      }]
    return of(recommendations);
  }
}

describe('RoadmapBubbleChartComponent', () => {
  let component: RoadmapBubbleChartComponent;
  let fixture: ComponentFixture<RoadmapBubbleChartComponent>;
  let mockAppService: MockAppService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoadmapBubbleChartComponent, AssessmentSummaryComponent],
      imports: [HttpClientTestingModule, MatCardModule, MatIconModule, MatTooltipModule],
      providers: [{provide: AppServiceService, useClass: MockAppService}],
      schemas:[NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadmapBubbleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges()
    mockAppService = new MockAppService()
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should get all the recommendations", () => {
    component.ngOnInit()
    component.assessmentId = 1

    component.getRecommendations()
    mockAppService.getAllRecommendations(1).subscribe(data =>{
      expect(data).toBeDefined()
    })

    expect(component.recommendationResponse.length).toBe(3)
  })

  it("should return empty label for chart ticks", () => {

    expect(component.tickFormat()).toBe("")
  });

});
