/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {HttpClientModule} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';

import {AppServiceService} from './app-service.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {AssessmentRequest} from "../../types/assessmentRequest";
import {SaveRequest} from "../../types/saveRequest";
import {AssessmentNotes} from "../../types/assessmentNotes";
import {TopicRecommendation} from "../../types/topicRecommendation";
import {TopicRating} from "../../types/topicRating";
import {ParameterRecommendation} from "../../types/parameterRecommendation";
import {ParameterRating} from "../../types/parameterRating";

describe('AppServiceService', () => {
  let service: AppServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
      ],
      providers: [
        AppServiceService,
      ]
    });
    service = TestBed.inject(AppServiceService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should get response from server', () => {
    expect(service.getAssessments()).toBeTruthy();
  })
  it('should add assessments', () => {
    let assessmentData: AssessmentRequest =
      {
        assessmentName: "abcdef",
        organisationName: "Rel23",
        domain: "Telecom",
        industry: "phone",
        teamSize: 10,
        users: [{email: "technicalbaba4u@gmail.com"}]
      }

    expect(service.addAssessments(assessmentData)).toBeTruthy()
  });

  it("should get categories", () => {
    expect(service.getCategories()).toBeTruthy()
  });

  it("should save assessment", () => {
    let AssessmentRequest: SaveRequest =
      {
        assessmentId: 123,
        topicRequest: {
          parameterLevel: [],
          topicRatingAndRecommendation: {
            topicId: 1,
            rating: "1",
            recommendation: "some text"
          }
        },


      };
    expect(service.saveAssessment(AssessmentRequest)).toBeTruthy()
  });

  it("should generate report", () => {
    expect(service.generateReport(123)).toBeTruthy()
  });

  it("should call finish assessment api", () => {
    expect(service.finishAssessment(123)).toBeTruthy()
  });

  it("should call reopen assessment api", () => {
    expect(service.reopenAssessment(123)).toBeTruthy()
  });

  it("should call get assessment api", () => {
    expect(service.getAssessment(123)).toBeTruthy()
  });

  it("should call update assessment", () => {
    let dummyAssessmentRequest: AssessmentRequest = {
      assessmentName: "",
      domain: "",
      organisationName: "",
      industry: "",
      teamSize: 0,
      users: []
    }
    expect(service.updateAssessment(123, dummyAssessmentRequest)).toBeTruthy()
  });

  it("should update particular answer", () => {
    let dummyAssessmentNotes: AssessmentNotes = {assessmentId: 1, questionId: 1, notes: "abc"}
    expect(service.saveNotes(dummyAssessmentNotes)).toBeTruthy()
  });

  it("should update particular topic Recommendation", () => {
    let dummyTopicRecommendation: TopicRecommendation = {assessmentId: 1, topicId: 1, recommendation: "abc"}
    expect(service.saveTopicRecommendation(dummyTopicRecommendation)).toBeTruthy()
  });

  it("should update particular topic Rating", () => {
    let dummyTopicRating: TopicRating = {assessmentId: 1, topicId: 1, rating: "1"}
    expect(service.saveTopicRating(dummyTopicRating)).toBeTruthy()
  });

  it("should update particular parameter Recommendation", () => {
    let dummyParameterRecommendation: ParameterRecommendation = {assessmentId: 1, parameterId: 1, recommendation: "abc"}
    expect(service.saveParameterRecommendation(dummyParameterRecommendation)).toBeTruthy()
  });

  it("should update particular parameter Rating", () => {
    let dummyParameterRating: ParameterRating = {assessmentId: 1, parameterId: 1, rating: "1"}
    expect(service.saveParameterRating(dummyParameterRating)).toBeTruthy()
  });

});
