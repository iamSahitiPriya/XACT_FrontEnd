import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RecommendationTableComponent} from './recommendation-table.component';
import {Recommendation} from "../../types/recommendation";

describe('RecommendationTableComponent', () => {
  let component: RecommendationTableComponent;
  let fixture: ComponentFixture<RecommendationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendationTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true when the delivery horizon is not displayed', () => {
    component.deliveryHorizon = ""
    let recommendation : Recommendation= {recommendation:"",deliveryHorizon:"NOW",impact:"LOW",effort:"MEDIUM",categoryName:"",updatedAt:12345}

    expect(component.isDeliveryHorizonDisplayed(recommendation)).toBeTruthy()
  });

  it("should return false when the delivery horizon is already displayed", () => {
    component.deliveryHorizon = "NOW"
    let recommendation : Recommendation= {recommendation:"",deliveryHorizon:"NOW",impact:"LOW",effort:"MEDIUM",categoryName:"",updatedAt:12345}

    expect(component.isDeliveryHorizonDisplayed(recommendation)).toBeFalsy()
  });

  it("should return the category color", () => {
    component.colorScheme = new Map<string, string>();
    component.colorScheme.set("category1","#abcde")
    component.colorScheme.set("category2","edfghe")

    expect(component.categoryColor("category1")).toBe("#abcde")
  });
});
