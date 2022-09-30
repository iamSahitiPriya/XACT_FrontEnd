/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchComponent} from './search.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AssessmentStructure} from "../../types/assessmentStructure";

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [MatFormFieldModule, MatIconModule, MatInputModule, BrowserAnimationsModule, MatInputModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call the search', () => {
    const mockData: AssessmentStructure = {
      domain: "", industry: "", teamSize: 0, users: [],
      assessmentId: 2,
      assessmentName: "abc",
      organisationName: "org",
      assessmentStatus: "Active",
      assessmentPurpose:"Client Request",
      updatedAt: 1002020,
      answerResponseList: [],
      parameterRatingAndRecommendation: [],
      topicRatingAndRecommendation: []

    }
    const inputValue = document.getElementById("search") as HTMLInputElement;
    inputValue.value = "dummyValue"
    component.columns = ['2','assessmentName','organisationName']
    component.searchAssessments()
    expect(component.dataSource.filterPredicate(mockData, "abc")).toBeTruthy()
    expect(component.dataSource.filterPredicate(mockData, "org")).toBeTruthy()
    expect(component.dataSource.filter).toBe("dummyvalue")
  });
  it("should return false if no result came", () => {
    const mockData: AssessmentStructure = {
      domain: "", industry: "", teamSize: 0, users: [],
      assessmentId: 2,
      assessmentName: "abc",
      organisationName: "org",
      assessmentStatus: "Active",
      assessmentPurpose:"Client Request",
      updatedAt: 1002020,
      answerResponseList: [],
      parameterRatingAndRecommendation: [],
      topicRatingAndRecommendation: []
    }
    component.columns = ['1','assessmentName']
    component.searchAssessments()
    expect(component.dataSource.filterPredicate(mockData, "xyz")).toBeFalsy()
  });
});
