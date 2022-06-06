/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TopicScoreComponent} from './topic-score.component';
import {MatCardModule} from "@angular/material/card";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('TopicScoreComponent', () => {
  let component: TopicScoreComponent;
  let fixture: ComponentFixture<TopicScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicScoreComponent ],
      imports:[MatCardModule,CommonModule,BrowserAnimationsModule]
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

  it('should able to set rating',()=>{
    const topicRatingAndRecommendation={
      rating :"2",
      recommendation :"some text",
      topicId : 1
    }
   jest.spyOn(component,"setRating");
    //
    // expect(spy).toHaveBeenCalled();
    component.topicRatingAndRecommendation=topicRatingAndRecommendation;
    component.assessmentStatus="Active"
    component.setRating("3")
    expect(topicRatingAndRecommendation.rating).toEqual("3");

  })

});

