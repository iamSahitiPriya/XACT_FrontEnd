import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ContributorAuthorComponent} from './contributor-author.component';
import {MatDialogModule} from "@angular/material/dialog";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../../reducers/reducers";
import {of, throwError} from "rxjs";
import {Question} from "../../../types/Contributor/Question";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {Ng2SearchPipe} from "ng2-search-filter";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";

describe('ContributorAuthorComponent', () => {
  let component: ContributorAuthorComponent;
  let mockAppService: MockAppService
  let fixture: ComponentFixture<ContributorAuthorComponent>;

  class MockAppService {
    questionResponse = {
      "contributorModuleData": [
        {
          "moduleId": 1,
          "moduleName": "Architecture Quality",
          "categoryName": "Software engineering",
          "categoryId": 1,
          "topics": [
            {
              "topicId": 1,
              "topicName": "Architectural style",
              "parameters": [
                {
                  "parameterId": 3,
                  "parameterName": "Data model",
                  "questions": [
                    {
                      "questionId": 1,
                      "question": "sadadasdasdasd RAMPRAK 123123  asdasdasda RAMPRAKASH asasdd asdasds",
                      "status": "Draft",
                      "isSelected":false
                    },
                    {
                      "questionId": 2,
                      "question": "HAHAHAHAasdas asdasd  asdasdas 123131232 asdasds",
                      "status": "Sent_For_Review",
                      "isSelected":false
                    },
                    {
                      "questionId": 3,
                      "question": "HELLOOOO",
                      "comments": "send to review",
                      "status": "Draft",
                      "isSelected":false
                    },
                    {
                      "questionId": 4,
                      "question": "helloasdasd",
                      "status": "Sent_For_Review",
                      "isSelected":false
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
    updateQuestionResponse = {
      "questionId": 606,
      "questionText": "qw-eqweasdasdczxc 23112312dasda",
      "questionStatus": "Draft",
      "comments": "this is a review",
      "createdAt": 1680000083534,
      "updatedAt": 1680178784710
    }

    getContributorQuestions(role: string) {
      if (role === 'Author') {
        return of(this.questionResponse)
      } else {
        return of()
      }
    }
    updateQuestion(questionId:number, question:string){
      if(questionId === 606){
        return of(this.updateQuestionResponse)
      }else{
        return throwError("Error!")
      }
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContributorAuthorComponent,Ng2SearchPipe],
      imports: [MatDialogModule, HttpClientTestingModule, MatSnackBarModule, StoreModule.forRoot(reducers),BrowserAnimationsModule,NoopAnimationsModule],
      providers: [
        {provide: AppServiceService, useClass: MockAppService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ContributorAuthorComponent);
    mockAppService = new MockAppService()
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.masterData = of([{
      "categoryId": 1,
      "categoryName": "category1",
      "active": true,
      "updatedAt": 12345,
      "comments": "comment1",
      "modules": [{
        "moduleId": 1,
        "moduleName": 'module1',
        "category": 1,
        "active": false,
        "updatedAt": 23456,
        "comments": " ",
        "topics": [{
          "topicId": 1,
          "topicName": "topic1",
          "module": 1,
          "updatedAt": 1234,
          "comments": "",
          "active": true,
          "parameters": [{
            "parameterId": 1,
            "parameterName": "parameter",
            "topic": 1,
            "updatedAt": 1234,
            "comments": "",
            "active": true,
            "questions": [{
              "questionId": 1,
              "questionText": "This is a question",
              "isEdit": false,
              "isSelected" : true,
              "parameter": 1
            }],
            "userQuestions": [],
            "references": [],
          }, {
            "parameterId": 5,
            "parameterName": "parameter",
            "topic": 1,
            "updatedAt": 1234,
            "comments": "",
            "active": true,
            "questions": [],
            "userQuestions": [],
            "references": [],
          }],
          "references": []
        }, {
          "topicId": 3,
          "topicName": "topic2",
          "module": 1,
          "updatedAt": 45678,
          "comments": "",
          "active": false,
          "parameters": [],
          "references": []
        }]
      },
        {
          "moduleId": 2,
          "moduleName": 'module2',
          "category": 1,
          "active": false,
          "updatedAt": 23456,
          "comments": " ",
          "topics": []
        }]
    }, {
      "categoryId": 3,
      "categoryName": "category3",
      "active": true,
      "updatedAt": 12345,
      "comments": "comment1",
      "modules": []
    }
    ])
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should edit contributor question', () => {
    component.ngOnInit()
    mockAppService.getContributorQuestions('Author').subscribe(data => {
      expect(data).toBeDefined()
    })

    let question: Question = {comments: "", question: "hello", questionId: 1, status: "Draft"}

    component.editQuestion(question)

    expect(component.contributorData.length).toBeGreaterThan(1)
  });
  it("should send question for review", () => {
    component.ngOnInit()
    jest.spyOn(component,'sendForReview')

    let question: Question = {comments: "", question: "hello", questionId: 1, status: "Draft"}
    let response = component.contributorData[0]

    component.sendForReview(question,response)
  });
  it("should cancel changes when click", () => {
    jest.spyOn(component, 'cancelChanges')
    component.overallComments="hello"
    component.ngOnInit()

    component.cancelChanges()

    expect(component.cancelChanges).toHaveBeenCalled()
    expect(component.contributorData.length).toBeGreaterThan(1)
  });
  it("should check whether the card is clicked", () => {
    jest.spyOn(component, 'isCardClicked')
    component.ngOnInit()

    let response = component.contributorData[0]

    component.isCardClicked(response)

    expect(response.isClicked).toBeTruthy()

  });
  it("should select all questions and send to review", () => {
    jest.spyOn(component,'sendAllQuestionsForReview')
    component.ngOnInit()

    let response = component.contributorData[0]

    component.setAllQuestions(true, response)
    component.sendAllQuestionsForReview(response)

    expect(component.sendAllQuestionsForReview).toHaveBeenCalled()

  });
  it("should update all questions which are selected", () => {
    jest.spyOn(component, 'updateAllSelectedStatus')
    component.ngOnInit()

    let response = component.contributorData[0]

    component.updateAllSelectedStatus(response)

    expect(component.updateAllSelectedStatus).toHaveBeenCalled()
    expect(response.allSelected).toBeFalsy()
  });
  it("should update individual contributor questions", () => {
    jest.spyOn(component,'updateQuestion')
    component.ngOnInit()

    let question: Question = {comments: "", question: "hello", questionId: 606, status: "Draft"}
    let response = component.contributorData[0]

    component.updateQuestion(question,response)
    mockAppService.updateQuestion(question.questionId,question.question).subscribe(data =>{
      expect(data).toBeDefined()
    })
  });
  it("should throw error on unsuccessful update call", () => {
    jest.spyOn(component,'showError')
    component.ngOnInit()

    let question: Question = {comments: "", question: "hello", questionId: 61, status: "Draft"}
    let response = component.contributorData[0]

    component.updateQuestion(question,response)
    mockAppService.updateQuestion(question.questionId,question.question).subscribe(data =>{
      expect(data).toBeUndefined()
      expect(component.showError).toHaveBeenCalled()
    })
  });

});
