/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminReferenceComponent} from './admin-reference.component';
import {HttpClientModule} from "@angular/common/http";
import {MatDialogModule} from "@angular/material/dialog";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../../reducers/reducers";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {of, throwError} from "rxjs";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {TopicReference} from "../../../types/topicReference";


class MockAppService {
  saveTopicReference(reference : TopicReference) {
    if(reference.reference === "new")
      return of(reference)
    else
      return throwError("Error!")
  }

  updateTopicReference(referenceId:number,reference : TopicReference) {
    if(reference.referenceId === 1)
      return of(reference)
    else
      return throwError("Error!")
  }

  deleteTopicReference(referenceId : number) {
    if(referenceId === 1)
      return of(referenceId)
    else
      return throwError("Error!")
  }

}


describe('AdminReferenceComponent', () => {
  let component: AdminReferenceComponent;
  let fixture: ComponentFixture<AdminReferenceComponent>;
  let mockAppService : MockAppService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminReferenceComponent ],
      imports : [MatSnackBarModule,HttpClientModule, MatDialogModule,StoreModule.forRoot(reducers),MatIconModule,MatTooltipModule,BrowserAnimationsModule,NoopAnimationsModule],
      providers: [
        {provide: AppServiceService, useClass: MockAppService}]
    })
      .compileComponents();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminReferenceComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
    mockAppService = new MockAppService();


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
          "parameters": [],
          "references": [{
            "rating" : 4,
            "reference" : "new reference",
            "referenceId": 1,
            "topic":1
          }]
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

  })

  it('should create', () => {
    component.ngOnInit()
    expect(component).toBeTruthy();
  });

  it("should get topic references", () => {
    component.ngOnInit()

    component.module = 1
    component.category = 1

    component.topic = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}

    component.topicReferences = [{rating:4,reference:"new reference",topic:1,referenceId:1,isEdit:false}]

    expect(component.topic.topicName).toBe("topic1")
    if (component.topicReferences) {
      expect(component.topicReferences[0].reference).toBe("new reference")
    }
  });

  it("should save topic reference", () => {

    let reference = {referenceId:-1,reference:"new",rating:1,topic:1}

    component.ngOnInit()
    component.topicId = 1
    component.unsavedReferences = [{referenceId:1,reference:"new reference",rating:4,topic:1}]

    jest.spyOn(component,"setReferenceRequest")
    jest.spyOn(component,"sendReferenceToStore")
    component.topic = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}

    component.saveTopicReference(reference)
    mockAppService.saveTopicReference(reference).subscribe(data => {
      expect(data).toBe(reference)
    })

    expect(component.sendReferenceToStore).toHaveBeenCalled()

  });

  it("should call show error method when there is an error while saving reference", () => {

    component.referenceToSend = {referenceId:-1,reference:"new reference",rating:1,topic:1}
    component.unsavedReferences = [{referenceId:1,reference:"new",rating:4,topic:1}]

    jest.spyOn(component,"setReferenceRequest")
    jest.spyOn(component,"showError")
    component.topic = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}

    component.saveTopicReference(component.referenceToSend)

    expect(component.showError).toHaveBeenCalled()

  });

  it("should update topic reference", () => {

    let reference = {referenceId:1,reference:"new",rating:1,isEdit:true,topic:1}


    component.unsavedReferences = [{referenceId:1,reference:"new",rating:4,topic:1}]

    jest.spyOn(component,"setReferenceRequest")
    jest.spyOn(component,"updateStore")
    component.topic = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}

    component.topicId = 1
    component.updateTopicReference(reference)

    expect(component.updateStore).toHaveBeenCalled()
  });

  it("should call show error method when there is an error while updating reference", () => {

    component.referenceToSend = {referenceId:2,reference:"new",rating:1,isEdit:true,topic:1}
    component.unsavedReferences = [{referenceId:2,reference:"new",rating:4,topic:1}]

    jest.spyOn(component,"setReferenceRequest")
    jest.spyOn(component,"showError")
    component.topic = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}

    component.updateTopicReference(component.referenceToSend)

    expect(component.showError).toHaveBeenCalled()
  });

  it("should  call delete topic reference", () => {

    let reference = {referenceId:1,reference:"new",rating:1,isEdit:true,topic:1}

    component.ngOnInit()
    component.topicReferences = [{referenceId:1,reference:"new",rating:4,topic:1}]

    jest.spyOn(component,"deleteTopicReference")
    component.topic = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}

    component.deleteMaturityReference(reference)

    expect(component.deleteTopicReference).toHaveBeenCalled()

  });

  it("should call show error method when there is an error while deleting reference", () => {

    component.referenceToSend = {referenceId:2,reference:"new",rating:1,isEdit:true,topic:1}
    component.topicReferences = [{referenceId:2,reference:"new",rating:4,topic:1}]

    jest.spyOn(component,"showError")
    component.topic = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}

    component.deleteMaturityReference(component.referenceToSend)

    expect(component.showError).toHaveBeenCalled()

  });

  it("should delete unsaved topic reference", () => {

    let reference = {referenceId:-1,reference:"new",rating:1,isEdit:true,topic:1}

    component.topicReferences = [{referenceId:1,reference:"new",rating:4,topic:1}]

    jest.spyOn(component,"deleteTopicReference")

    component.topic = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}

    component.deleteMaturityReference(reference)

    expect(component.topicReferences.length).toBe(0)
  });

  it("should delete unsaved topic reference before adding a new one", () => {
    component.topicReferences = [{referenceId:-1,reference:"new",rating:4,topic:1}]

    component.topic = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}

    component.topicId = 2
    component.addMaturityReference()

    expect(component.topicReferences.length).toBe(1)
  });

  it("should add topic references to the topicReferences Array", () => {
    component.topicReferences = [{referenceId:1,reference:"new",rating:4,topic:1}]
    component.topic = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}

    component.topicId = 2
    component.addMaturityReference()

    expect(component.topicReferences.length).toBe(2)
  });

  it("should return false if the topicReferences Array is undefined", () => {
    component.topicReferences = undefined
    component.topic = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}

    expect(component.isReferenceArrayFull()).toBe(false)
  });

  it("should add references to topicReferences Array", () => {
    component.topicReferences = [{referenceId:1,reference:"new",rating:4,topic:1}]
    component.topic = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}
    component.category = 1
    component.module = 1

    jest.spyOn(component,"getReferenceFromTopic")

    component.ngOnInit()
    component.setTopicReferences()

    expect(component.getReferenceFromTopic).toHaveBeenCalled()
  });


  it("should close the popup", () => {
    component.ngOnInit()
    component.topicReferences = [{referenceId:1,reference:"new",rating:4,topic:1},{referenceId:2,reference:"new reference",rating:3,topic:1}]
    component.unsavedReferences = [{referenceId:1,reference:"new reference",rating:4,topic:1}]
    component.topic = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}
    component.category = 1
    component.module = 1

    component.close()

    expect(component.topicReferences.length).toBe(1)
  });

  it("should show error", () => {
    const message = "This is an error message"
    jest.spyOn(component, "showError")

    component.showError(message)

    expect(component.showError).toHaveBeenCalled()
  });

  it("should throw error when rating is not unique", () => {

    let reference = {referenceId:-1,reference:"new",rating:1,isEdit:true,topic:1}


    component.unsavedReferences = [{referenceId:1,reference:"new",rating:1,topic:1}]

    jest.spyOn(component,"setReferenceRequest")
    jest.spyOn(component,"showError")
    jest.spyOn(component,"updateTopicReference")
    component.topic = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}

    component.saveTopicReference(reference)

    expect(component.showError).toHaveBeenCalled()
  });

  it("should throw error when reference is not unique", () => {

    let reference = {referenceId:-1,reference:"new",rating:1,isEdit:true,topic:1}


    component.unsavedReferences = [{referenceId:1,reference:"new",rating:4,topic:1}]

    jest.spyOn(component,"setReferenceRequest")
    jest.spyOn(component,"showError")
    jest.spyOn(component,"updateTopicReference")
    component.topic = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}

    component.saveTopicReference(reference)

    expect(component.showError).toHaveBeenCalled()
  });

  it("should add newly added reference to the store", () => {

    let reference :TopicReference= {referenceId:2,reference:"new",rating:1,topic:1}


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
        "updatedAt": 23456,
        "comments": " ",
        "topics": [{
          "topicId": 1,
          "topicName": "topic1",
          "module": 1,
          "updatedAt": 1234,
          "comments": "",
          "active": true,
          "parameters": [],
          "references": [{
            "rating" : 4,
            "reference" : "new reference",
            "referenceId": 1,
            "topic":1
          }]
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
    component.topic = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}
    component.category = 1
    component.module = 1

    component.sendReferenceToStore(reference)

    expect(component.categories[0].modules[0].topics[0].references.length).toBe(2)
  });

  it("should delete the reference from the store", () => {

    let reference :TopicReference= {referenceId:1,reference:"new",rating:1,topic:1}

    component.ngOnInit()
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
        "updatedAt": 23456,
        "comments": " ",
        "topics": [{
          "topicId": 1,
          "topicName": "topic1",
          "module": 1,
          "updatedAt": 1234,
          "comments": "",
          "active": true,
          "parameters": [],
          "references": [{
            "rating" : 4,
            "reference" : "new reference",
            "referenceId": 1,
            "topic":1
          }]
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
    jest.spyOn(component,"deleteFromStore")
    component.topic = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}
    component.category = 1
    component.module = 1

    component.deleteTopicReference(reference)

    expect(component.deleteFromStore).toHaveBeenCalled()
    expect(component.categories[0].modules[0].topics[0].references.length).toBe(1)
  });

  it("should update the reference to the store", () => {

    let reference :TopicReference= {referenceId:1,reference:"new",rating:1,topic:1}


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
        "updatedAt": 23456,
        "comments": " ",
        "topics": [{
          "topicId": 1,
          "topicName": "topic1",
          "module": 1,
          "updatedAt": 1234,
          "comments": "",
          "active": true,
          "parameters": [],
          "references": [{
            "rating" : 4,
            "reference" : "new reference",
            "referenceId": 1,
            "topic":1
          }]
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
    component.topic = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}
    component.category = 1
    component.module = 1

    component.updateStore(reference)

    expect(component.categories[0].modules[0].topics[0].references.length).toBe(1)
  });

  it("should return true if the input is not valid", () => {

    let reference = {referenceId:-1,reference:"",rating:1,isEdit:true,topic:1}

    expect(component.isInputValid(reference)).toBeTruthy()
  });

  it("should change the selected value to true if the rating is already saved", () => {
    component.unsavedReferences = [{referenceId:1,reference:"new reference",rating:4,topic:1}]
    component.rating = [{rating:1,selected:false},{rating:2,selected: false},{rating:3,selected: false},{rating:4,selected: false},{rating:5,selected: false}]

    component.disableSavedRatings()

    expect(component.rating[3].selected).toBeTruthy()
  });

  it("should cancel changes", () => {
    let reference = {referenceId:1,reference:"",rating:1,isEdit:true,topic:1}
    component.unsavedChanges = {referenceId:1,reference:"new reference",rating:4,topic:1}

    component.cancelChanges(reference)

    expect(reference.rating).toBe(4)
  });

  it("should change the selected reference when add maturity reference is clicked while updating another reference",() => {
    component.topicReferences = [{referenceId:1,reference:"reference",rating:1,topic:1},{referenceId:2,reference:"reference2",rating:2,topic:1}]
    component.selectedReference = {isEdit : true,reference:"new reference",topic:1,rating:2}
    component.unsavedChanges = {referenceId:1,reference:"reference",rating:1,topic:1}

    component.topicId = 1
    component.addMaturityReference()

    expect(component.selectedReference.reference).toBe("")
  })

  it("should set isEdit to true when the user clicks on edit button of particular reference",() => {
    component.selectedReference = {isEdit : true,reference:"new reference",topic:1,rating:2}
    let reference = {referenceId:1,reference:"reference",isEdit:false,rating:1,topic:1}

    component.topicId = 1
    component.setIsEdit(reference)

    expect(reference.isEdit).toBeTruthy()
    expect(component.selectedReference.reference).toBe("reference")
  })

});

