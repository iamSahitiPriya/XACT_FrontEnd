import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RecommendationTableComponent} from './recommendation-table.component';
import {Recommendation} from "../../types/recommendation";


describe('RecommendationTableComponent', () => {
  let component: RecommendationTableComponent;
  let fixture: ComponentFixture<RecommendationTableComponent>;
  let recommendations : Recommendation[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendationTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendationTableComponent);
    component = fixture.componentInstance;
    recommendations = [{recommendation:"Recommendation1",impact:"LOW",effort:"LOW",deliveryHorizon:"NOW",updatedAt:0,categoryName:"NEW"},
      {recommendation:"Recommendation2",impact:"LOW",effort:"LOW",deliveryHorizon:"NEXT",updatedAt:0,categoryName:"NEW"},
      {recommendation:"Recommendation3",impact:"LOW",effort:"LOW",deliveryHorizon:"LATER",updatedAt:0,categoryName:"NEW"}
    ]
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should format data for Recommendation Table' , () => {
    component.recommendations = recommendations;
    jest.spyOn(component,"formatDataForTable");
    component.ngOnInit();
    expect(component.formatDataForTable).toHaveBeenCalled();
  })


  it("should return the category color", () => {
    component.colorScheme = new Map<string, string>();
    component.colorScheme.set("category1","#abcde")
    component.colorScheme.set("category2","edfghe")

    expect(component.categoryColor("category1")).toBe("#abcde")
  });
});
