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
import {TopicRating} from "../../types/topicRating";
import {ParameterRating} from "../../types/parameterRating";
import {TopicLevelRecommendationTextRequest} from "../../types/topicLevelRecommendationTextRequest";
import {ParameterLevelRecommendationTextRequest} from "../../types/parameterLevelRecommendationTextRequest";

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
            rating: 1,
            topicLevelRecommendation: [
              {
                recommendation: "some text",
                impact: "HIGH",
                effort: "LOW",
                deliveryHorizon: "some text"
              }
            ],
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
    let dummyAssessmentNotes: AssessmentNotes = {assessmentId: 1, questionId: 1, notes: ""}
    expect(service.saveNotes(dummyAssessmentNotes)).toBeTruthy()
  });

  it("should update particular topic Recommendation", () => {
    let dummyTopicRecommendation: TopicLevelRecommendationTextRequest = {
      assessmentId: 1, topicId: 1,
      topicLevelRecommendation:
        {
          recommendationId: 1,
          recommendation: "some text"

        }
    }
    expect(service.saveTopicRecommendationText(dummyTopicRecommendation)).toBeTruthy()
  });

  it("should update particular topic Recommendation fields", () => {
    let dummyTopicRecommendation: TopicLevelRecommendationTextRequest = {
      assessmentId: 1, topicId: 1,
      topicLevelRecommendation:
        {
          recommendationId: 1,
          recommendation: "some text",
          impact: "HIGH",
          effort: "LOW",
          deliveryHorizon: "some more text"
        }
    }
    expect(service.saveTopicRecommendationFields(dummyTopicRecommendation)).toBeTruthy()
  });


  it("should delete topic recommendation", () => {
    let assessmentId = 1;
    let topicId = 1;
    let recommendationId = 1

    expect(service.deleteTopicRecommendation(assessmentId, topicId, recommendationId)).toBeTruthy()
  });

  it("should update particular topic Rating", () => {
    let dummyTopicRating: TopicRating = {assessmentId: 1, topicId: 1, rating: 1}
    expect(service.saveTopicRating(dummyTopicRating)).toBeTruthy()
  });

  it("should update particular parameter Recommendation", () => {
    let dummyParameterRecommendation: ParameterLevelRecommendationTextRequest = {
      assessmentId: 1,
      parameterId: 1,
      parameterLevelRecommendation: {recommendationId: 1, recommendation: ""}
    }
    expect(service.saveParameterRecommendation(dummyParameterRecommendation)).toBeTruthy()
  });

  it("should update particular parameter Rating", () => {
    let dummyParameterRating: ParameterRating = {assessmentId: 1, parameterId: 1, rating: 1}
    expect(service.saveParameterRating(dummyParameterRating)).toBeTruthy()
  });
  it("should get report data for chart summary", () => {
    expect(service.getReportData(1)).toBeTruthy()
  });

  it("should delete parameter recommendation", () => {
    let assessmentId = 1;
    let parameterId = 1;
    let recommendationId = 1

    expect(service.deleteParameterRecommendation(assessmentId, parameterId, recommendationId)).toBeTruthy()
  });

  it("should update particular parameter Recommendation fields", () => {
    let dummyParameterRecommendation: ParameterLevelRecommendationTextRequest = {
      assessmentId: 1, parameterId: 1,
      parameterLevelRecommendation:
        {
          recommendationId: 1,
          recommendation: "some text",
          impact: "HIGH",
          effort: "LOW",
          deliveryHorizon: "some more text"
        }
    }
    expect(service.saveParameterRecommendation(dummyParameterRecommendation)).toBeTruthy()
  });
  it("should get all categories", () => {
    expect(service.getAllCategories()).toBeTruthy()
  });
  it("should save categories", () => {
    let categoryRequest = {
      "categoryName": "hello",
      "active": true,
      "comments": ""
    }
    expect(service.saveCategory(categoryRequest)).toBeTruthy()
  });
  it("should update categories", () => {
    let categoryRequest = {
      "categoryName": "hello",
      "active": true,
      "comments": ""
    }
    expect(service.updateCategory(categoryRequest)).toBeTruthy()
  });

  it("should get the assessment data for admin", () => {
    let adminAssessmentRequest ={
      "assessmentId": 1,
      "endDate": "2022-06-01",
      "startDate": "2022-07-13"
    }
    expect(service.getAdminAssessment(adminAssessmentRequest)).toBeTruthy()
  });
  it("should get the report for assessment data", () => {
    let adminAssessmentRequest ={
      "assessmentId": 1,
      "endDate": "2022-06-01",
      "startDate": "2022-07-13"
    }
    expect(service.generateAdminReport(adminAssessmentRequest)).toBeTruthy()
  });
});
