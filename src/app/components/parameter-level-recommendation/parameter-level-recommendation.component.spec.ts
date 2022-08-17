import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterLevelRecommendationComponent } from './parameter-level-recommendation.component';

describe('ParameterLevelRecommendationComponent', () => {
  let component: ParameterLevelRecommendationComponent;
  let fixture: ComponentFixture<ParameterLevelRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParameterLevelRecommendationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterLevelRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
