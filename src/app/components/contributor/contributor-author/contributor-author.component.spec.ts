import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ContributorAuthorComponent} from './contributor-author.component';
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../../reducers/reducers";
import {of, throwError} from "rxjs";
import {Question} from "../../../types/Contributor/Question";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {Ng2SearchPipe} from "ng2-search-filter";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";

describe('ContributorAuthorComponent', () => {
  let component: ContributorAuthorComponent;
  let mockAppService: MockAppService
  let matDialog : any
  let fixture: ComponentFixture<ContributorAuthorComponent>;
  class MockDialog {
    questionResponse = {
      "questionId": [
        1
      ],
      "comments": "sdasdas",
      "status": "Sent_For_Review"
    }
    open() {
      return {
        afterClosed: () => of(1),
        componentInstance: {
          onSave:of(this.questionResponse)
        }
      }
    }
    closeAll() {
    }
  }

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
                      "status": "DRAFT",
                      "isSelected":false
                    },
                    {
                      "questionId": 2,
                      "question": "HAHAHAHAasdas asdasd  asdasdas 123131232 asdasds",
                      "status": "SENT_FOR_REVIEW",
                      "isSelected":false
                    },
                    {
                      "questionId": 3,
                      "question": "HELLOOOO",
                      "comments": "send to review",
                      "status": "DRAFT",
                      "isSelected":false
                    },
                    {
                      "questionId": 4,
                      "question": "helloasdasd",
                      "status": "SENT_FOR_REVIEW",
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
      "questionId": 1,
      "questionText": "qw-eqweasdasdczxc 23112312dasda",
      "questionStatus": "DRAFT",
      "comments": "this is a review",
      "createdAt": 1680000083534,
      "updatedAt": 1680178784710
    }

    getContributorQuestions(role: string) {
      if (role === 'AUTHOR') {
        return of(this.questionResponse)
      } else {
        return of()
      }
    }
    updateQuestion(questionId:number, question:string){
      if(questionId === 1){
        return of(this.updateQuestionResponse)
      }else{
        return throwError("Error!")
      }
    }
    deleteQuestion(questionId : number) {
      if(questionId === 1) {
      return of(this.questionResponse);}
      else {
        return throwError("Error!")
      }

    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContributorAuthorComponent,Ng2SearchPipe],
      imports: [MatDialogModule, HttpClientTestingModule, MatSnackBarModule, MatFormFieldModule,MatInputModule,MatCheckboxModule,FormsModule,MatCardModule,MatIconModule,
        StoreModule.forRoot(reducers),BrowserAnimationsModule,NoopAnimationsModule, MatTooltipModule],
      providers: [
        {provide: AppServiceService, useClass: MockAppService},{provide: MatDialog, useClass: MockDialog}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ContributorAuthorComponent);
    mockAppService = new MockAppService()
    component = fixture.componentInstance;
    matDialog = fixture.debugElement.injector.get(MatDialog)
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

    component.contributorData  = [{
      allSelected: true,
      categoryId: 1,
      categoryName: "category",
      isClicked: false,
      moduleId: 1,
      moduleName: "module",
      parameterId: 1,
      parameterName: "parameter",
      questions: [{
        "questionId": 1,
        "question": "This is a question",
        "isEdit": false,
        "isSelected" : true,
        "comments" : "comment",
        "status" : "DRAFT"
      }],
      topicId: 1,
      topicName: "topic"
    }]
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should edit contributor question', () => {
    component.ngOnInit()
    mockAppService.getContributorQuestions('AUTHOR').subscribe(data => {
      expect(data).toBeDefined()
    })

    let question: Question = {comments: "", question: "hello", questionId: 1, status: "DRAFT"}

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
    expect(response.allSelected).toBeTruthy()
  });
  it("should update individual contributor questions", () => {
    jest.spyOn(component,'updateQuestion')
    component.ngOnInit()

    let question: Question = {comments: "", question: "hello", questionId: 1, status: "Draft"}
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

  it("it should return isAllQuestionsOpened as true when user clicked on all questions", () => {
    component.ngOnInit()

    component.openAllQuestions(component.contributorData[0])

    expect(component.isAllQuestionsOpened).toBeTruthy()
    expect(component.parameterData.parameterId).toBe(1)
  });

  it("it should return isAllQuestionsOpened as false when user clicked on all questions close", () => {
    component.ngOnInit()

    component.closeQuestions()

    expect(component.isAllQuestionsOpened).toBeFalsy()
  });

  it("it should return true when all the question statuses are sent for review", () => {
    component.ngOnInit()

    component.contributorData[0].questions[0].status = "SENT_FOR_REVIEW"
    component.contributorData[0].questions[0].isSelected = false

    let expectedResult = component.isSentForReview(component.contributorData[0])

    expect(expectedResult).toBeTruthy()
  });
  it("should subscribe to an instance after save", () => {
    component.ngOnInit()
    jest.spyOn(component,'sendForReview')
    jest.spyOn(matDialog,'open')

    let question: Question = {comments: "", question: "hello", questionId: 1, status: "Draft"}
    let response = component.contributorData[0]

    component.sendForReview(question,response)

    expect(matDialog.open).toHaveBeenCalled()
  });

  it("it should delete question", () => {
    component.ngOnInit()

    jest.spyOn(matDialog, "open")
    component.deleteQuestion(component.contributorData[0].questions[0],component.contributorData[0])

    expect(matDialog.open).toHaveBeenCalled()
  });

  it("it should throw error when unsuccessful delete", () => {
    component.ngOnInit()

    jest.spyOn(matDialog, "open")
    component.contributorData[0].questions[0].questionId = 5
    component.deleteQuestion(component.contributorData[0].questions[0],component.contributorData[0])

    expect(matDialog.open).toHaveBeenCalled()
  });

});
