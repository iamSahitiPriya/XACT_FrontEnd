import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendationTableComponent } from './recommendation-table.component';

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
});
