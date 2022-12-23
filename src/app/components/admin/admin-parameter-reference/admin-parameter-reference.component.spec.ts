import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminParameterReferenceComponent} from './admin-parameter-reference.component';
import {of, throwError} from "rxjs";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {HttpClientModule} from "@angular/common/http";
import {MatDialogModule} from "@angular/material/dialog";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../../reducers/reducers";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {ParameterReference} from "../../../types/parameterReference";

class MockAppService {
  saveParameterReference(reference : any) {
    if(reference.reference === "new")
      return of(reference)
    else
      return throwError("Error!")
  }

  updateParameterReference(referenceId:number,reference : any) {
    if(reference.referenceId === 1)
      return of(reference)
    else
      return throwError("Error!")
  }

  deleteParameterReference(referenceId : any) {
    if(referenceId === 1)
      return of(referenceId)
    else
      return throwError("Error!")
  }

}

describe('AdminParameterReferenceComponent', () => {
  let component: AdminParameterReferenceComponent;
  let fixture: ComponentFixture<AdminParameterReferenceComponent>;
  let mockAppService : MockAppService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminParameterReferenceComponent ],
      imports : [MatSnackBarModule,HttpClientModule, MatDialogModule,StoreModule.forRoot(reducers),MatIconModule,MatTooltipModule,BrowserAnimationsModule,NoopAnimationsModule],
      providers: [
        {provide: AppServiceService, useClass: MockAppService}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminParameterReferenceComponent);
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
          "parameters": [{
            "parameterId": 1,
            "parameterName": "parameter1",
            "topic": 1,
            "updatedAt": 1234,
            "comments": "",
            "active": true,
            "questions" : [],
            "userQuestions":[],
            "references": [{
              "rating" : 4,
              "reference" : "new reference",
              "referenceId": 1,
              "parameter":1
            }]
          }],
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
    expect(component).toBeTruthy();
  });

  it("should get parameter references", () => {
    component.ngOnInit()

    component.module = 1
    component.category = 1
    component.topic = 1

    component.parameter = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", topicStatus:true,parameterId:1,parameterName:"parameter1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}

    component.parameterReferences = [{rating:4,reference:"new reference",parameter:1,referenceId:1,isEdit:false}]

    expect(component.parameter.parameterName).toBe("parameter1")
    if (component.parameterReferences) {
      expect(component.parameterReferences[0].reference).toBe("new reference")
    }
  });

  it("should save parameter reference", () => {

    let reference = {referenceId:-1,reference:"new",rating:1}

    component.ngOnInit()
    component.unsavedReferences = [{referenceId:1,reference:"new reference",rating:4,parameter:1}]

    jest.spyOn(component,"setReferenceRequest")
    jest.spyOn(component,"sendReferenceToStore")
    component.parameter = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", topicStatus:true,parameterId:1,parameterName:"parameter1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}

    component.saveParameterReference(reference)

    expect(component.sendReferenceToStore).toHaveBeenCalled()
  });

  it("should call show error method when there is an error while saving parameter reference", () => {

    component.referenceToSend = {referenceId:-1,reference:"new reference",rating:1}
    component.unsavedReferences = [{referenceId:1,reference:"new",rating:4,parameter:1}]

    jest.spyOn(component,"setReferenceRequest")
    jest.spyOn(component,"showError")
    component.parameter = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", topicStatus:true,parameterId:1,parameterName:"parameter1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}

    component.saveParameterReference(component.referenceToSend)

    expect(component.showError).toHaveBeenCalled()

  });

  it("should update parameter reference", () => {

    let reference = {referenceId:1,reference:"new",rating:1,isEdit:true}

    component.unsavedReferences = [{referenceId:1,reference:"new",rating:4,parameter:1}]

    jest.spyOn(component,"setReferenceRequest")
    jest.spyOn(component,"updateStore")
    component.parameter = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", topicStatus:true,parameterId:1,parameterName:"parameter1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}

    component.updateParameterReference(reference)

    expect(component.updateStore).toHaveBeenCalled()
  });

  it("should call show error method when there is an error while updating parameter reference", () => {

    component.referenceToSend = {referenceId:2,reference:"new",rating:1,isEdit:true}
    component.unsavedReferences = [{referenceId:2,reference:"new",rating:4,parameter:1}]

    jest.spyOn(component,"setReferenceRequest")
    jest.spyOn(component,"showError")
    component.parameter = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", topicStatus:true,parameterId:1,parameterName:"parameter1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}

    component.updateParameterReference(component.referenceToSend)

    expect(component.showError).toHaveBeenCalled()
  });

  it("should  call delete parameter reference", () => {

    let reference = {referenceId:1,reference:"new",rating:1,isEdit:true}

    component.ngOnInit()
    component.parameterReferences = [{referenceId:1,reference:"new",rating:4,parameter:1}]

    jest.spyOn(component,"deleteParameterReference")
    component.parameter = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", topicStatus:true,parameterId:1,parameterName:"parameter1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}

    component.deleteMaturityReference(reference)

    expect(component.deleteParameterReference).toHaveBeenCalled()

  });

  it("should delete unsaved parameter reference", () => {

    let reference = {referenceId:-1,reference:"new",rating:1,isEdit:true}

    component.parameterReferences = [{referenceId:1,reference:"new",rating:4,parameter:1}]

    jest.spyOn(component,"deleteParameterReference")

    component.parameter = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", topicStatus:true,parameterId:1,parameterName:"parameter1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}

    component.deleteMaturityReference(reference)

    expect(component.parameterReferences.length).toBe(0)
  });

  it("should delete unsaved parameter reference before adding a new one", () => {
    component.parameterReferences = [{referenceId:-1,reference:"new",rating:4,parameter:1}]

    component.parameter = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", topicStatus:true,parameterId:1,parameterName:"parameter1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}

    component.addMaturityReference()

    expect(component.parameterReferences.length).toBe(1)
  });

  it("should add parameter references to the parameterReferences Array", () => {
    component.parameterReferences = [{referenceId:1,reference:"new",rating:4,parameter:1}]
    component.parameter = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", topicStatus:true,parameterId:1,parameterName:"parameter1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}

    component.addMaturityReference()

    expect(component.parameterReferences.length).toBe(2)
  });

  it("should return false if the parameterReferences Array is undefined", () => {
    component.parameterReferences = undefined
    component.parameter = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", topicStatus:true,parameterId:1,parameterName:"parameter1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}

    expect(component.isReferenceArrayFull()).toBe(false)
  });

  it("should add references to parameterReferences Array", () => {
    component.parameterReferences = [{referenceId:1,reference:"new",rating:4,parameter:1}]
    component.parameter = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", topicStatus:true,parameterId:1,parameterName:"parameter1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}
    component.category = 1
    component.module = 1
    component.topic =1

    jest.spyOn(component,"getReferenceFromParameter")

    component.ngOnInit()
    component.setParameterReferences()

    expect(component.getReferenceFromParameter).toHaveBeenCalled()
  });

  it("should close the popup", () => {
    component.ngOnInit()
    component.parameterReferences = [{referenceId:1,reference:"new",rating:4,parameter:1},{referenceId:2,reference:"new reference",rating:3,parameter:1}]
    component.unsavedReferences = [{referenceId:1,reference:"new reference",rating:4,parameter:1}]
    component.parameter = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", topicStatus:true,parameterId:1,parameterName:"parameter1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}
    component.category = 1
    component.module = 1
    component.topic = 1

    component.close()

    expect(component.parameterReferences.length).toBe(1)
  });

  it("should show error", () => {
    const message = "This is an error message"
    jest.spyOn(component, "showError")

    component.showError(message)

    expect(component.showError).toHaveBeenCalled()
  });

  it("should throw error when rating is not unique in parameter references", () => {

    let reference = {referenceId:-1,reference:"new",rating:1,isEdit:true}


    component.unsavedReferences = [{referenceId:1,reference:"new",rating:1,parameter:1}]

    jest.spyOn(component,"setReferenceRequest")
    jest.spyOn(component,"showError")
    jest.spyOn(component,"updateParameterReference")
    component.parameter = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", topicStatus:true,parameterId:1,parameterName:"parameter1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}

    component.saveParameterReference(reference)

    expect(component.showError).toHaveBeenCalled()
  });

  it("should throw error when parameter reference is not unique", () => {

    let reference = {referenceId:-1,reference:"new",rating:1,isEdit:true}


    component.unsavedReferences = [{referenceId:1,reference:"new",rating:4,parameter:1}]

    jest.spyOn(component,"setReferenceRequest")
    jest.spyOn(component,"showError")
    jest.spyOn(component,"updateParameterReference")
    component.parameter = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", topicStatus:true,parameterId:1,parameterName:"parameter1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}

    component.saveParameterReference(reference)

    expect(component.showError).toHaveBeenCalled()
  });

  it("should add newly added parameter reference to the store", () => {

    let reference :ParameterReference= {referenceId:2,reference:"new",rating:1,parameter:1}

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
          "parameters": [{
            "parameterId": 1,
            "parameterName": "parameter1",
            "topic": 1,
            "updatedAt": 1234,
            "comments": "",
            "active": true,
            "questions" : [],
            "userQuestions":[],
            "references": [{
              "rating" : 4,
              "reference" : "new reference",
              "referenceId": 1,
              "parameter":1
            }]
          }],
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
    component.parameter = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", topicStatus:true,parameterId:1,parameterName:"parameter1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}
    component.category = 1
    component.module = 1
    component.topic = 1

    component.sendReferenceToStore(reference)

    expect(component.categories[0].modules[0].topics[0].parameters[0].references.length).toBe(2)
  });

  it("should delete the reference from the store", () => {

    let reference :ParameterReference= {referenceId:1,reference:"new",rating:1,parameter:1}

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
          "parameters": [{
            "parameterId": 1,
            "parameterName": "parameter1",
            "topic": 1,
            "updatedAt": 1234,
            "comments": "",
            "active": true,
            "questions" : [],
            "userQuestions":[],
            "references": [{
              "rating" : 4,
              "reference" : "new reference",
              "referenceId": 1,
              "parameter":1
            }]
          }],
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
    component.parameter = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", topicStatus:true,parameterId:1,parameterName:"parameter1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}
    component.category = 1
    component.module = 1
    component.topic = 1

    component.deleteParameterReference(reference)

    expect(component.deleteFromStore).toHaveBeenCalled()
    expect(component.categories[0].modules[0].topics[0].parameters[0].references.length).toBe(1)
  });

  it("should update the reference to the store", () => {

    let reference :ParameterReference= {referenceId:1,reference:"new",rating:1,parameter:1}


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
          "parameters": [{
            "parameterId": 1,
            "parameterName": "parameter1",
            "topic": 1,
            "updatedAt": 1234,
            "comments": "",
            "active": true,
            "questions" : [],
            "userQuestions":[],
            "references": [{
              "rating" : 4,
              "reference" : "new reference",
              "referenceId": 1,
              "parameter":1
            }]
          }],
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
    component.parameter = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", topicStatus:true,parameterId:1,parameterName:"parameter1", active: false, updatedAt: Date.now(), comments: "", isEdit: true,}
    component.category = 1
    component.module = 1
    component.topic = 1

    component.updateStore(reference)

    expect(component.categories[0].modules[0].topics[0].parameters[0].references.length).toBe(1)
  });

  it("should return true if the input is not valid", () => {

    let reference = {referenceId:-1,reference:"",rating:1,isEdit:true}

    expect(component.isInputValid(reference)).toBeTruthy()
  });

  it("should change the selected value to true if the rating is already saved", () => {
    component.unsavedReferences = [{referenceId:1,reference:"new reference",rating:4,parameter:1}]
    component.rating = [{rating:1,selected:false},{rating:2,selected: false},{rating:3,selected: false},{rating:4,selected: false},{rating:5,selected: false}]

    component.disableSavedRatings()

    expect(component.rating[3].selected).toBeTruthy()
  });

  it("should cancel changes", () => {
    let reference = {referenceId:1,reference:"",rating:1,isEdit:true}
    component.unsavedChanges = {referenceId:1,reference:"new reference",rating:4,parameter:1}

    component.cancelChanges(reference)

    expect(reference.rating).toBe(4)
  });

  it("should return true when parameter reference array size is 5", () => {
    component.parameterReferences = [{referenceId:1,reference:"new reference",rating:4,parameter:1},{referenceId:4,reference:"new reference4",rating:2,parameter:1},{referenceId:5,reference:"new reference5",rating:3,parameter:1},
                              {referenceId:2,reference:"new reference2",rating:5,parameter:1},{referenceId:3,reference:"new reference3",rating:1,parameter:1}]

    expect( component.isReferenceArrayFull()).toBeTruthy()
  });
});
