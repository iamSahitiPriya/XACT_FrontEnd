/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {HttpClientModule} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';

import {AppServiceService} from './app-service.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {AssessmentRequest} from "../../types/assessmentRequest";
import {SaveRequest} from "../../types/saveRequest";

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
        topicRequest :{
          parameterLevel:[

          ],
            topicRatingAndRecommendation :{
                  topicId :1,
                  rating:"1",
                  recommendation:"some text"
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

});
