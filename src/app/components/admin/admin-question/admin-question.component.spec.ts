import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminQuestionComponent} from './admin-question.component';
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../../reducers/reducers";
import {of, throwError} from "rxjs";
import {HttpClientModule} from "@angular/common/http";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {MatCardModule} from "@angular/material/card";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {Question} from "../../../types/Admin/question";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";

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
        onSave: of(this.questionResponse)
      }
    }
  }

  closeAll() {
  }
}

class MockAppService {
  response = {
    questionId: 2,
    questionText: "Hello",
    parameter: 1,
    topic: 1,
    category: 1,
    module: 1
  }

  updateMasterQuestion(questionId: any, questionRequest: any) {
    if (questionId === 1) {
      return of(this.response)
    } else
      return throwError("Error!")
  }

  saveMasterQuestion(questionRequest: any) {
    if (questionRequest.questionText === "This is a question text") {
      return of(this.response)
    } else if (questionRequest.questionText === "This is a question text2") {
      this.response.parameter = 5
      return of(this.response)
    } else {
      return throwError("Error!")
    }
  }

  deleteQuestion(questionId: number) {
    if (questionId === 1) {
      return of(this.response);
    } else {
      return throwError("Error!")
    }

  }
}

describe('AdminQuestionComponent', () => {
  let component: AdminQuestionComponent;
  let fixture: ComponentFixture<AdminQuestionComponent>;
  let mockAppService: MockAppService
  let matDialog: any
  let row: Question

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminQuestionComponent],
      imports: [StoreModule.forRoot(reducers), BrowserAnimationsModule, NoopAnimationsModule, HttpClientModule, MatSnackBarModule, MatCardModule, MatDialogModule, MatIconModule, MatTooltipModule],
      providers: [
        {provide: AppServiceService, useClass: MockAppService},
        {provide: MatDialog, useClass: MockDialog}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdminQuestionComponent);
    component = fixture.componentInstance;
    mockAppService = new MockAppService();
    matDialog = fixture.debugElement.injector.get(MatDialog)
    fixture.detectChanges();
    // @ts-ignore
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
            "questions": undefined,
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
    component.parameter = {
      categoryId: 1,
      categoryName: "category1",
      categoryStatus: false,
      moduleId: 1,
      moduleName: "module1",
      moduleStatus: false,
      topicId: 1,
      topicName: "topic1",
      topicStatus: false,
      parameterId: 1,
      parameterName: "parameter",
      active: false,
      updatedAt: Date.now(),
      comments: "",
    }
    component.topic = 1
    component.module = 1
    component.category = 1
    row = {questionId: 1, questionText: "This is a question text", parameter: 1, isEdit: false}

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should display questions', () => {
    jest.spyOn(component, 'getQuestionsFromParameter')

    component.ngOnInit()

    expect(component.getQuestionsFromParameter).toHaveBeenCalled()
    expect(component.categoryResponse).toBeDefined()
  });

  it("should add question text on clicking add question button", () => {
    jest.spyOn(component, 'addQuestionRow')
    jest.spyOn(component, 'deleteUnsavedQuestion')

    component.ngOnInit()
    const button = fixture.nativeElement.querySelector(".questionButton1");
    button.click();

    expect(component.addQuestionRow).toHaveBeenCalled()
    expect(component.deleteUnsavedQuestion).toHaveBeenCalled()
  });

  it("should enable edit on clicking the edit button", () => {
    jest.spyOn(component, 'setIsEdit')

    component.ngOnInit()
    component.setIsEdit(row)

    expect(component.setIsEdit).toHaveBeenCalled()
    expect(component.unsavedQuestion).toBeDefined()
  });

  it("should cancel changes on clicking cancel button", () => {
    jest.spyOn(component, 'cancelChanges')
    component.unsavedQuestion = row

    component.ngOnInit()
    component.cancelChanges(row)

    expect(component.cancelChanges).toHaveBeenCalled()
    expect(row.isEdit).toBeFalsy()
  });

  it("should update question with respective changes", () => {
    jest.spyOn(component, 'getQuestionRequest')
    jest.spyOn(component, 'updateQuestion')

    component.ngOnInit()
    component.updateQuestion(row)

    mockAppService.updateMasterQuestion(1, row).subscribe(data => {
      expect(data).toBeDefined()
    })

    expect(component.updateQuestion).toHaveBeenCalled()
  });

  it("should able to save questions", () => {
    jest.spyOn(component, 'saveQuestion')

    component.ngOnInit()
    component.saveQuestion(row)
    component.parameter = {
      categoryId: 1,
      categoryName: "category1",
      categoryStatus: false,
      moduleId: 1,
      moduleName: "module1",
      moduleStatus: false,
      topicId: 1,
      topicName: "topic1",
      topicStatus: false,
      parameterId: -1,
      parameterName: "parameter",
      active: false,
      updatedAt: Date.now(),
      comments: "",
    }

    mockAppService.saveMasterQuestion(row).subscribe(data => {
      expect(data).toBeDefined()
    })

    expect(component.saveQuestion).toHaveBeenCalled()
  });

  it("should able to save new questions for the parameter that doesn't have any questions before", () => {
    jest.spyOn(component, 'saveQuestion')

    component.ngOnInit()
    component.parameter.parameterId = 5
    row = {questionId: 1, questionText: "This is a question text2", parameter: 5, isEdit: false}
    expect(component.categoryResponse[0].modules[0].topics[0].parameters[1].questions).toBeUndefined()

    component.saveQuestion(row)
    component.parameter = {
      categoryId: 1,
      categoryName: "category1",
      categoryStatus: false,
      moduleId: 1,
      moduleName: "module1",
      moduleStatus: false,
      topicId: 1,
      topicName: "topic1",
      topicStatus: false,
      parameterId: -1,
      parameterName: "parameter",
      active: false,
      updatedAt: Date.now(),
      comments: "",
    }

    mockAppService.saveMasterQuestion(row).subscribe(data => {
      expect(data).toBeDefined()
    })

    expect(component.saveQuestion).toHaveBeenCalled()
    expect(component.categoryResponse[0].modules[0].topics[0].parameters[1].questions.length).toBe(1)
  });

  it("should throw error on unsuccessful save", () => {
    jest.spyOn(component, 'saveQuestion')
    jest.spyOn(component, 'showError')
    let row = {questionId: -1, questionText: "This is a question", parameter: 1, isEdit: true}

    component.ngOnInit()
    component.saveQuestion(row)

    mockAppService.saveMasterQuestion(row).subscribe(data => {
      expect(data).toBeUndefined()
    }, (error) => {
      expect(error).toBe(new Error("Error!"))
    });
    expect(component.showError).toHaveBeenCalled()
  });

  it("should throw error on unsuccessful update", () => {
    jest.spyOn(component, 'getQuestionRequest')
    jest.spyOn(component, 'showError')
    let row = {questionId: 2, questionText: "This is a question text", parameter: 1, isEdit: true}

    component.ngOnInit()
    component.updateQuestion(row)

    mockAppService.updateMasterQuestion(2, row).subscribe(data => {
        expect(data).toBeUndefined()
      }, (error) => {
        expect(error).toBe(new Error("Error!"))
      }
    )

    expect(component.showError).toHaveBeenCalled()
  });

  it("should reset question before closing the popup", () => {
    jest.spyOn(component, 'close')
    component.close()

    expect(component.close).toHaveBeenCalled()

  });

  it("should validate input field before saving/updating", () => {
    jest.spyOn(component, 'isInputValid')

    let row = "This is a question text"
    let result = component.isInputValid(row)

    expect(component.isInputValid).toHaveBeenCalled()
    expect(result).toBeFalsy()
  });

  it("should remove unsaved question from the array", () => {
    let questions = [{questionId: -1, questionText: "question1", parameter: 1}]
    component.questionStatusMap.set('Draft', questions)

    component.deleteUnsavedQuestion()

    expect(component.questionStatusMap.get('Draft')?.length).toBeUndefined()
  });

  it("should send questions for review", () => {
    let question: Question = {
      parameter: 0, questionId: 1, questionText: "", status: 'Draft', isEdit: false
    }
    let question2: Question = {
      parameter: 0, questionId: 1, questionText: "", status: 'Sent_For_Review', isEdit: false
    }
    let questions: Question[] = []
    let questions2: Question[] = []
    questions.push(question2)
    questions2.push(question)
    jest.spyOn(component, 'deleteQuestion')

    component.ngOnInit()
    component.questionStatusMap.set('Draft', questions)
    component.questionStatusMap.set('Sent_For_Review', questions2)

    jest.spyOn(matDialog, "open")
    component.sendForReview(question)

    expect(matDialog.open).toHaveBeenCalled()

  });
  it("should delete question", () => {
    component.ngOnInit()
    let question: Question = {
      parameter: 1, questionId: 1, questionText: "", status: 'Draft', isEdit: false
    }
    let questions: Question[] = []
    questions.push(question)
    jest.spyOn(component, 'deleteQuestion')
    component.questionStatusMap.set('Draft', questions)
    component.deleteQuestion(question)

    expect(component.deleteQuestion).toHaveBeenCalled()
  });

  it("should throw error on unsuccessful delete", () => {
    component.ngOnInit()
    let question: Question = {
      parameter: 1, questionId: 2, questionText: "", status: 'Draft', isEdit: false
    }
    jest.spyOn(component, 'deleteQuestion')
    jest.spyOn(component, 'showError')

    component.deleteQuestion(question)

    mockAppService.deleteQuestion(question.questionId).subscribe(data => {
      expect(data).toBeUndefined()
      expect(component.showError).toHaveBeenCalled()
    })

    expect(component.deleteQuestion).toHaveBeenCalled()
  });
});
