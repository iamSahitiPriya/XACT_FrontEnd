/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminQuestionReferenceComponent} from './admin-question-reference.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {HttpClientModule} from "@angular/common/http";
import {MatDialogModule} from "@angular/material/dialog";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../../reducers/reducers";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {of, throwError} from "rxjs";
import {QuestionReference} from "../../../types/QuestionReference";

class MockAppService {
  saveQuestionReference(reference: QuestionReference) {
    if (reference.reference === "new")
      return of(reference)
    else
      return throwError("Error!")
  }

  updateQuestionReference(referenceId: number, reference: QuestionReference) {
    if (reference.referenceId === 1)
      return of(reference)
    else
      return throwError("Error!")
  }

  deleteQuestionReference(referenceId: number) {
    if (referenceId === 1)
      return of(referenceId)
    else
      return throwError("Error!")
  }

}

describe('AdminQuestionReferenceComponent', () => {
  let component: AdminQuestionReferenceComponent;
  let fixture: ComponentFixture<AdminQuestionReferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminQuestionReferenceComponent],
      imports: [MatSnackBarModule, HttpClientModule, MatDialogModule, StoreModule.forRoot(reducers), MatIconModule, MatTooltipModule, BrowserAnimationsModule, NoopAnimationsModule],
      providers: [
        {provide: AppServiceService, useClass: MockAppService}]

    })
      .compileComponents();

    fixture = TestBed.createComponent(AdminQuestionReferenceComponent);
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
        "contributors": [],
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
            "parameterName": "parameter1",
            "topic": 1,
            "updatedAt": 1234,
            "comments": "",
            "active": true,
            "questions": [{
              "questionId": 1,
              "questionText": "new Question",
              "status": "",
              "parameter": 1,
              "comments": "",
              "references": [{
                "rating": 4,
                "reference": "new reference",
                "referenceId": 1,
                "question": 1,
                "isEdit": false
              }]
            }],
            "userQuestions": [],
            "references": []
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

    component.categories = [{
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
        "contributors": [],
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
            "parameterName": "parameter1",
            "topic": 1,
            "updatedAt": 1234,
            "comments": "",
            "active": true,
            "questions": [{
              "questionId": 1,
              "questionText": "new Question",
              "status": "",
              "parameter": 1,
              "comments": "",
              "references": [{
                "rating": 4,
                "reference": "new reference",
                "referenceId": 1,
                "question": 1,
                "isEdit": false
              }]
            }],
            "userQuestions": [],
            "references": []
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
      }]
    }, {
      "categoryId": 3,
      "categoryName": "category3",
      "active": true,
      "updatedAt": 12345,
      "comments": "comment1",
      "modules": []
    }
    ]
    component.question = {
      parameter: 1, questionId: 1, questionText: ""
    }
    component.category = 1;
    component.module = 1;
    component.topic = 1;
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.questionReferences?.length).toBe(1)
  });
  it("should add references", () => {
    component.selectedReference = {referenceId: 1, reference: "reference", isEdit: false, rating: 1, question: 1}
    component.question = {
      parameter: 1, questionId: 1, questionText: ""
    }
    component.addMaturityReference();

    expect(component.questionReferences?.length).toBe(1)
  });
  it("should delete the unsaved references ", () => {
    component.selectedReference = {referenceId: 1, reference: "reference", isEdit: false, rating: 1, question: 1}
    component.question = {
      parameter: 1, questionId: 1, questionText: ""
    }
    component.unsavedChanges={referenceId: 1, reference: "reference", isEdit: false, rating: 1, question: 1}
    component.questionReferences=[{referenceId: -1, reference: "reference", isEdit: false, rating: 1, question: 1},{referenceId: 1, reference: "reference", isEdit: false, rating: 1, question: 1}]

    jest.spyOn(component,'deleteUnSavedReferences')
    component.addMaturityReference();

    expect(component.deleteUnSavedReferences).toHaveBeenCalled()
  });
  it("should save question references", () => {
    let reference: QuestionReference = {question: 1, rating: 1, reference: "new"}
    component.ngOnInit();
    jest.spyOn(component, "sendReferenceToStore")

    component.saveQuestionReference(reference);
    expect(component.sendReferenceToStore).toHaveBeenCalled()
  });
  it("should show error when  save question references api has error", () => {
    let reference: QuestionReference = {question: 1, rating: 1, reference: "new ref"}
    component.ngOnInit();
    jest.spyOn(component, "showError")

    component.saveQuestionReference(reference);
    expect(component.showError).toHaveBeenCalled()
  });
  it("should update question reference", () => {
    let reference: QuestionReference = {question: 1, rating: 1, reference: "new thing", referenceId: 1}
    component.ngOnInit()

    jest.spyOn(component, 'updateStore')
    component.updateQuestionReference(reference);
    expect(component.updateStore).toHaveBeenCalled()
  });
  it("should call error when update question reference has error", () => {
    let reference: QuestionReference = {question: 1, rating: 1, reference: "new thing", referenceId: 2}
    component.ngOnInit()

    jest.spyOn(component, 'showError')
    component.updateQuestionReference(reference);
    expect(component.showError).toHaveBeenCalled()
  });
  it("should delete question reference", () => {
    let reference: QuestionReference = {question: 1, rating: 1, reference: "new thing", referenceId: 1}
    component.ngOnInit()

    jest.spyOn(component, 'deleteQuestionReference');
    jest.spyOn(component, 'deleteFromStore');

    component.deleteMaturityReference(reference);
    expect(component.deleteQuestionReference).toHaveBeenCalled();
    expect(component.deleteFromStore).toHaveBeenCalled()
  });
  it("should call show error when delete reference api call has error", () => {
    let reference: QuestionReference = {question: 1, rating: 1, reference: "new thing", referenceId: 2}
    component.ngOnInit()

    jest.spyOn(component, 'deleteQuestionReference');
    jest.spyOn(component, 'deleteFromStore');
    jest.spyOn(component,'showError');

    component.deleteMaturityReference(reference);
    expect(component.deleteQuestionReference).toHaveBeenCalled();
    expect(component.showError).toHaveBeenCalled();
  });
  it("should close the popup", () => {
    component.ngOnInit()
    jest.spyOn(component, 'updateUnsavedChangesToStore');
    component.close();
    expect(component.updateUnsavedChangesToStore).toHaveBeenCalled();
  });
  it("should show error", () => {
    const message = "This is an error message"
    jest.spyOn(component, "showError")

    component.showError(message)

    expect(component.showError).toHaveBeenCalled()
  });
  it("should call cancel changes when cancel is clicked", () => {
    let reference: QuestionReference = {question: 1, rating: 1, reference: "new thing", referenceId: 2}

    jest.spyOn(component,'resetReference')
    component.cancelChanges(reference);

    expect(component.resetReference).toHaveBeenCalled()
  });
  it("should save valid input", () => {
    let reference: QuestionReference = {question: 1, rating: 1, reference: "new thing", referenceId: 2}

    expect(component.isInputValid(reference)).toBe(false)
  });
  it("should able to set the edit values for reference", () => {
    let reference: QuestionReference = {question: 1, rating: 1, reference: "new thing", referenceId: 2}

    component.selectedReference = {referenceId: 1, reference: "reference", isEdit: false, rating: 1, question: 1}
    component.question = {
      parameter: 1, questionId: 1, questionText: ""
    }
    component.unsavedChanges={referenceId: 1, reference: "reference", isEdit: false, rating: 1, question: 1}
    component.questionReferences=[{referenceId: -1, reference: "reference", isEdit: false, rating: 1, question: 1},{referenceId: 1, reference: "reference", isEdit: false, rating: 1, question: 1}]

    jest.spyOn(component,'setIsEdit')
    component.setIsEdit(reference);

    expect(component.setIsEdit).toHaveBeenCalled()
  });
});
