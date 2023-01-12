/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {HttpClientModule} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';

import {AppServiceService} from './app-service.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {AssessmentRequest} from "../../types/assessmentRequest";
import {SaveRequest} from "../../types/saveRequest";
import {TopicRating} from "../../types/topicRating";
import {ParameterRating} from "../../types/parameterRating";
import {TopicLevelRecommendationTextRequest} from "../../types/topicLevelRecommendationTextRequest";
import {ParameterLevelRecommendationTextRequest} from "../../types/parameterLevelRecommendationTextRequest";
import {UserAssessmentModuleRequest} from "../../types/UserAssessmentModuleRequest";
import {UserQuestion} from "../../types/UserQuestion";
import {UserQuestionRequest} from "../../types/userQuestionRequest";
import {AnswerRequest} from "../../types/answerRequest";

describe('AppServiceService', () => {
  let service: AppServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [
        AppServiceService
      ]
    });
    jest.spyOn(AppServiceService.prototype,'formatURI').mockImplementation(() => "some URI");;
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
        assessmentPurpose: "Client Request",
        domain: "Telecom",
        industry: "phone",
        teamSize: 10,
        users: [{email: "technicalbaba4u@gmail.com"}]
      }

    expect(service.addAssessments(assessmentData)).toBeTruthy()
  });

  it("should get categories", () => {
    let assessmentId = 0
    expect(service.getCategories(assessmentId)).toBeTruthy()
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
      assessmentPurpose: "",
      industry: "",
      teamSize: 0,
      users: []
    }
    expect(service.updateAssessment(123, dummyAssessmentRequest)).toBeTruthy()
  });

  it("should update particular answer", () => {
    let answerRequest: AnswerRequest = {questionId: 1, answer: "", type: "ADDITIONAL"}
    expect(service.saveNotes(1, answerRequest)).toBeTruthy()
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
    expect(service.saveTopicRecommendation(dummyTopicRecommendation)).toBeTruthy()
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

  it("should Save Module", () => {
    let moduleRequest = {
      "categoryId": 1,
      "moduleName": "module",
      "active": true,
    }
    expect(service.saveModule(moduleRequest)).toBeTruthy();
  });

  it("should Save Module", () => {
    let moduleRequest = {
      "categoryId": 1,
      "moduleName": "module",
      "active": true,
    }
    expect(service.updateModule(moduleRequest)).toBeTruthy();
  });

  it("should get the assessment data for admin", () => {
    let adminAssessmentRequest = {
      "assessmentId": 1,
      "endDate": "2022-06-01",
      "startDate": "2022-07-13"
    }
    expect(service.getAdminAssessment(adminAssessmentRequest)).toBeTruthy()
  });
  it("should get the report for assessment data", () => {
    let adminAssessmentRequest = {
      "assessmentId": 1,
      "endDate": "2022-06-01",
      "startDate": "2022-07-13"
    }
    expect(service.generateAdminReport(adminAssessmentRequest)).toBeTruthy()
  });
  it("should save the modules selected by user", () => {
    let userAssessmentModuleRequest: UserAssessmentModuleRequest[] = [{"moduleId": 1}]

    expect(service.saveUserModules(userAssessmentModuleRequest, 1)).toBeTruthy()
  });
  it("should update the modules selected by user", () => {
    let userAssessmentModuleRequest: UserAssessmentModuleRequest[] = [{"moduleId": 1}]

    expect(service.updateUserModules(userAssessmentModuleRequest, 1)).toBeTruthy()
  });
  it("should get the organisation names", () => {
    expect(service.getOrganizationName("org")).toBeTruthy();
  });
  it("should get template", () => {
    expect(service.getTemplate()).toBeTruthy();
  })
  it("should save topics", () => {
    let topic: any = {module: 1, topicName: "new topic", active: true, comments: "comments"}
    expect(service.saveTopic(topic)).toBeTruthy()
  })
  it("should update topics", () => {
    let topicRequest: any = {comments: "new comments", module: 1, topicName: "topic", active: true}
    expect(service.updateTopic(topicRequest, 1)).toBeTruthy();
  })
  it("should get only selected categories", () => {
    expect(service.getOnlySelectedCategories(1)).toBeTruthy();
  })
  it("should save module", () => {
    let moduleRequest = {moduleName: "module", active: true, comments: ""}
    expect(service.saveModule(moduleRequest)).toBeTruthy();
  })
  it("should update module", () => {
    let moduleRequest = {moduleName: "module", active: true, comments: ""}
    expect(service.updateModule(moduleRequest)).toBeTruthy();
  })


  it("should get only selected categories", () => {
    expect(service.getOnlySelectedCategories(1)).toBeTruthy();
  });
  it("should save new added question by user", () => {
    let assessmentId = 1, parameterId = 1
    let userQuestionRequest: UserQuestionRequest = {
      question: "question by user"
    }

    expect(service.saveUserQuestion(userQuestionRequest, assessmentId, parameterId)).toBeTruthy()
  });

  it("should update user question", () => {
    let userQuestion: UserQuestion = {
      questionId: 1, question: "updated"
    }
    let assessmentId = 1;
    expect(service.updateUserQuestion(userQuestion, assessmentId)).toBeTruthy()
  });

  it("should delete new added question by user", () => {
    let assessmentId = 1, questionId = 1
    expect(service.deleteUserQuestion(assessmentId, questionId)).toBeTruthy()
  });

  it("should delete assessment", () => {
    expect(service.deleteAssessment(1)).toBeTruthy();
  });
  it("should save parameter", () => {
    let parameterRequest = {parameterName: "parameter", active: true, comments: ""}
    expect(service.saveParameter(parameterRequest)).toBeTruthy();
  })
  it("should update parameter", () => {
    let parameterRequest = {parameterName: "parameter", active: true, comments: ""}
    let parameterId = 1
    expect(service.updateParameter(parameterRequest, parameterId)).toBeTruthy();
  })
  it("should save topic reference", () => {
    let topicRequest = {topic: 1, reference: "new", rating: 1}
    expect(service.saveTopicReference(topicRequest)).toBeTruthy();
  })
  it("should update topic reference", () => {
    let topicRequest = {topic: 1, reference: "new", rating: 1, referenceId: 1}
    let referenceId = 1
    expect(service.updateTopicReference(referenceId, topicRequest)).toBeTruthy();
  })
  it("should delete topic reference", () => {
    let referenceId = 1
    expect(service.deleteTopicReference(referenceId)).toBeTruthy();
  })
  it("should save parameter reference", () => {
    let parameterRequest = {parameter: 1, reference: "new", rating: 1}
    expect(service.saveParameterReference(parameterRequest)).toBeTruthy();
  })
  it("should update parameter reference", () => {
    let parameterRequest = {parameter: 1, reference: "new", rating: 1, referenceId: 1}
    let referenceId = 1
    expect(service.updateParameterReference(referenceId, parameterRequest)).toBeTruthy();
  })
  it("should delete parameter reference", () => {
    let referenceId = 1
    expect(service.deleteParameterReference(referenceId)).toBeTruthy();
  })

  it("should create questions", () => {
    let questionRequest = {questionText: "new", parameter:1}
    expect(service.saveMasterQuestion(questionRequest)).toBeTruthy()
  });

  it("should update questions", () => {
    let questionRequest = {questionId:1,questionText: "new", parameter:1}
    let questionId = 1
    expect(service.updateMasterQuestion(questionId,questionRequest)).toBeTruthy()
  });

  it("should get summary data", () => {
    let assessmentId = 1
    expect(service.getSummaryData(assessmentId)).toBeTruthy()
  });
});

