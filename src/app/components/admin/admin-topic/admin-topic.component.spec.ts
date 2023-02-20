/*
 *  Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminTopicComponent} from './admin-topic.component';
import {HttpClientModule} from "@angular/common/http";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {SearchComponent} from "../../search-component/search.component";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatTableModule} from "@angular/material/table";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {Observable, of, throwError} from "rxjs";
import {TopicStructure} from "../../../types/topicStructure";
import {CategoryResponse} from "../../../types/categoryResponse";
import {MatIconModule} from "@angular/material/icon";
import {TopicData} from "../../../types/topicData";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../../reducers/reducers";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";

class MockAppService {
  topic: TopicStructure = {
    topicId: 1,
    topicName: "topic1",
    active: true,
    comments: "",
    updatedAt: 12345,
    module: 1,
    parameters: [],
    references: []
  }
  data: CategoryResponse [] = [{
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

  row : TopicData = {
    active: false,
    categoryId: 1,
    categoryName: "category1",
    categoryStatus: false,
    comments: "",
    moduleId: 1,
    moduleName: "module1",
    moduleStatus: false,
    topicId: 1,
    topicName: "topic new",
    updatedAt: 0

  }

  getAllCategories(): Observable<CategoryResponse[]> {
    return of(this.data)
  }

  saveTopic(row: TopicData) {
    if (row.comments === "") {
      return of(row)
    } else {
      return throwError("Error!")
    }
  }

  updateTopic(row: TopicData, topicId: number) {
    if (topicId === 1) {
      return of(this.row)
    } else {
      return throwError("Error!")
    }
  }
}

class MockDialog {
  open() {
    return {
      afterClosed: () => of(1),
      componentInstance: jest.fn()
    }
  }

  closeAll() {
  }

}

describe('AdminTopicComponent', () => {
  let component: AdminTopicComponent;
  let fixture: ComponentFixture<AdminTopicComponent>;
  let mockAppService: MockAppService
  let matDialog : any
  let topicRequest: TopicData
  let row: TopicData
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminTopicComponent, SearchComponent],
      imports: [HttpClientModule, MatPaginatorModule, BrowserAnimationsModule, MatTableModule, MatSlideToggleModule, FormsModule, NoopAnimationsModule, MatSnackBarModule, MatInputModule, MatIconModule, StoreModule.forRoot(reducers), MatDialogModule],
      providers: [{provide: AppServiceService, useClass: MockAppService}, MatPaginator,{provide: MatDialog, useClass: MockDialog}],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTopicComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
    mockAppService = new MockAppService();
    matDialog = fixture.debugElement.injector.get(MatDialog)

    row = {
      categoryId: 1,
      categoryName: "category1",
      categoryStatus: false,
      moduleId: 1,
      moduleName: "module1",
      moduleStatus: false,
      topicId: -1,
      topicName: "topicnew",
      active: false,
      updatedAt: Date.now(),
      comments: "",
      isEdit: true,
    }
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

    topicRequest  = {comments: "comment", moduleId: 1, topicName: "new topic", active: true,categoryName:"name",categoryId:1,categoryStatus:true,moduleName:"name",moduleStatus:false,updatedAt:12345,topicId:1}

    component.moduleList = [{moduleId: 1, moduleName: "module1", active: true,category:1},
      {moduleId: 2, moduleName: "module2", active: true,category:2}]

    component.unsavedTopic = {active: false, comments: "", updatedAt: 0, categoryId:1,categoryName:"new",categoryStatus:true,moduleStatus:true,moduleId:2,moduleName:"new",topicId:2,topicName:"new"}
    component.selectedTopic = {active: false, comments: "", updatedAt: 0, categoryId:1,categoryName:"new",categoryStatus:true,moduleStatus:true,moduleId:2,moduleName:"new",topicId:2,topicName:"new"}

    component.topicData = [{
      "categoryName": "category1",
      "categoryId": 1,
      "categoryStatus" : true,
      "moduleName": "module1",
      "moduleId" : 1,
      "moduleStatus":true,
      "topicId" : 1,
      "topicName" : "topic2",
      "comments": "comments",
      "updatedAt": 1022022,
      "active": true
    }]

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should get topic data", () => {
    component.ngOnInit()
    expect(component.topicData[0].topicName).toBe("topic2")
  });

  it("should save topic", () => {
    mockAppService.saveTopic(row).subscribe((data) => {
      expect(component.sendToStore(data)).toHaveBeenCalled()
      expect(data).toBe(row)
    })
  });

  it("should throw error when saving topic", () => {
    row.comments = "comments"

    jest.spyOn(component, "saveTopic")
    jest.spyOn(component, "getTopicRequest")
    jest.spyOn(component, "isTopicUnique")
    jest.spyOn(component, "setTopicRequest")
    jest.spyOn(component, "showError")
    component.ngOnInit()

    component.saveTopic(row)

    expect(component.showError).toHaveBeenCalled()
  });

  it("should update topic", () => {
    mockAppService.updateTopic(topicRequest, -1).subscribe((data) => {
      expect(component.sendToStore(data)).toHaveBeenCalled()
      expect(data).toBe(topicRequest)
    })
  });

  it("should throw error while updating topic", () => {
    jest.spyOn(component, "showError")
    component.ngOnInit()
    component.unsavedTopic = row

    component.updateTopic(row)

    expect(component.showError).toHaveBeenCalled()
  });

  it("should add new rows", () => {
    component.ngOnInit()
    let length = component.dataSource.data.length

    component.addTopicRow()

    expect(component.selectedTopic?.moduleId).toBe(-1)
    expect(component.dataSource.data.length).toBe(length + 1)
    expect(component.paginator).toBeDefined()
  });

  it("should delete row from the table on clicking the bin button", () => {
    row.topicId = -1
    component.ngOnInit()
    component.dataSource.data.push(row)
    expect(component.dataSource.data.length).toBe(4)

    component.deleteAddedTopicRow()

    expect(component.dataSource.data.length).toBe(3)
    expect(component.selectedTopic).toBeNull()
  });

  it("should save new topics", () => {
    jest.spyOn(component, "saveTopic")
    jest.spyOn(component, "getTopicRequest")
    jest.spyOn(component, "isTopicUnique")
    jest.spyOn(component, "setTopicRequest")

    component.isEditable = true
    component.ngOnInit()
    component.saveTopic(row)

    let data = {"active": false, "comments": "", "module": 1, "topicName": "topicnew"}

    expect(component.getTopicRequest(row)).toStrictEqual(data)
    expect(component.isEditable).toBeFalsy()
  });

  it("should show error when saving the topic already exists", () => {
    row.comments = ""
    row.topicName = "topic1"

    component.isEditable = true
    component.ngOnInit()
    jest.spyOn(component, "isTopicUnique")
    jest.spyOn(component, "showError")

    component.getTopicRequest(row)

    expect(component.getTopicRequest(row)).toBe(null)
    expect(component.showError).toHaveBeenCalled()
  });

  it("should return null when the selected module is undefined", () => {
    row.comments = ""
    row.moduleName = "module123new"

    component.isEditable = true
    component.ngOnInit()

    component.setTopicRequest(row)

    expect(component.setTopicRequest(row)).toBe(null)
  });

  it("should update topic", () => {
    let row1: TopicData = {
      active: false,
      categoryId: 1,
      categoryName: "category1",
      categoryStatus: false,
      comments: "",
      moduleId: 1,
      moduleName: "module1",
      moduleStatus: false,
      topicId: 1,
      topicName: "topic2",
      updatedAt: 0
    }

    component.ngOnInit()
    jest.spyOn(component, "updateTopic")
    jest.spyOn(component, "getTopicRequest")

    component.isEditable = true
    component.unsavedTopic = row1
    row.topicId = 1

    component.updateTopic(row)

    expect(component.getTopicRequest(row)).toBeDefined()
  });

  it("should shortlist module according to category name", () => {
    component.ngOnInit()

    component.shortlistModule(row)

    expect(component.moduleList.length).toBe(1)
  });

  it("should display no modules available when no module is available in the selected category", () => {
    row.categoryName = "category4"
    component.ngOnInit()
    component.shortlistModule(row)

    expect(component.moduleList.length).toBe(1)
    expect(component.moduleList[0].moduleName).toBe("No modules available")
  });

  it("should cancel update topic", () => {
    jest.spyOn(component, "cancelUpdate")
    jest.spyOn(component, "resetTopic")
    component.selectedTopic = null
    component.unsavedTopic = row

    component.cancelUpdate(row)

    expect(component.resetTopic).toHaveBeenCalled()
  });

  it("should reset unsaved topic", () => {

    let newRow: TopicData = {
      active: false,
      categoryId: 1,
      categoryName: "category1",
      categoryStatus: false,
      comments: "",
      moduleId: 1,
      moduleName: "module2",
      moduleStatus: false,
      topicId: 1,
      topicName: "topic new",
      updatedAt: 0
    }

    component.unsavedTopic = row
    component.dataSource.data = [{
      active: false,
      categoryId: 1,
      categoryName: "category1",
      categoryStatus: false,
      comments: "",
      moduleId: 1,
      moduleName: "module1",
      moduleStatus: false,
      topicId: -1,
      topicName: "topic new",
      updatedAt: 0
    }
    ]

    component.resetUnsavedChanges(newRow)

    expect(component.dataSource.data[0].topicName).toBe("topicnew")

  });

  it("should open reference dialog", () => {
    jest.spyOn(matDialog, "open")

    component.openTopicReferences("",row)
    fixture.detectChanges()
    expect(matDialog.open).toHaveBeenCalled()
  });

  it("should show error when topic has parameter level reference", () => {
    component.ngOnInit()
    row.categoryName = "category1"
    row.moduleName = "module1"
    row.topicName = "topic1"
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
              "referenceId" : 1,
              "reference" : "reference",
              "rating":2,
              "parameter":1
            }],
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
    jest.spyOn(component, "showError")

    component.openTopicReferences("",row)
    fixture.detectChanges()
    expect(component.showError).toHaveBeenCalled()
  });

  it("should return category id of the selected row", () => {
    jest.spyOn(component,"findCategoryId")
    component.ngOnInit()

    expect(component.findCategoryId(row)).toBe(1)
  });

  it("should return module id of the selected row", () => {
    jest.spyOn(component,"findModuleId")
    component.ngOnInit()

    expect(component.findModuleId(row)).toBe(1)
  });

  it("should return true if the inputs are not valid",() => {
    row.categoryName = ""
    row.moduleName = ""
    row.topicName = ""
    expect(component.isInputValid(row)).toBeTruthy()
  })

  it("should set isEdit to false and isEditable to true when the user clicks on edit button",() => {
    component.ngOnInit()

    component.editTopic(row)

    expect(component.isEditable).toBeTruthy()
    expect(row.isEdit).toBeFalsy()
  })

  it("should change the value to lower case while sorting the topic table for string valued columns", () => {
    component.sortTopic()

    let expectedResponse = component.dataSource.sortingDataAccessor(component.topicData[0],'topicName');

    expect(expectedResponse).toBe("topic2")
  });

  it("should return the same value while sorting the topic table for other column types than string", () => {
    component.sortTopic()

    let expectedResponse = component.dataSource.sortingDataAccessor(component.topicData[0],'active');

    expect(expectedResponse).toBe(true)
  });
});
