import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicScoreComponent } from './topic-score.component';
import {MatCardModule} from "@angular/material/card";

describe('TopicScoreComponent', () => {
  let component: TopicScoreComponent;
  let fixture: ComponentFixture<TopicScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicScoreComponent ],
      imports:[MatCardModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
