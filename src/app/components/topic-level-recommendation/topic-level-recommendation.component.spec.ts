import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TopicLevelRecommendationComponent} from './topic-level-recommendation.component';
import {MatFormFieldModule} from "@angular/material/form-field";

import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";

describe('TopicLevelRecommendationComponent', () => {
  let component: TopicLevelRecommendationComponent;
  let fixture: ComponentFixture<TopicLevelRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopicLevelRecommendationComponent],
      imports: [MatFormFieldModule, NoopAnimationsModule, FormsModule, ReactiveFormsModule, MatInputModule],
      providers: [
        NgForm
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicLevelRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});

