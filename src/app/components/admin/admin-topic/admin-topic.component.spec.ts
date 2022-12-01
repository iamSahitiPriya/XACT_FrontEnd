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

  getAllCategories(): Observable<any> {
    return of(this.data)
  }

  saveTopic(row: TopicData) {
    if (row.comments === "") {
      return of(row)
    } else {
      return throwError("Error!")
    }
  }

  updateTopic(row: any, topicId: number) {
    if (topicId === -1) {
      return of(row)
    } else {
      return throwError("Error!")
    }
  }
}

describe('AdminTopicComponent', () => {
  let component: AdminTopicComponent;
  let fixture: ComponentFixture<AdminTopicComponent>;
  let mockAppService: MockAppService
  let row: { categoryId: number, categoryName: string, categoryStatus: boolean, moduleId: number, moduleName: string, moduleStatus: boolean, topicId: number, topicName: string, active: boolean, updatedAt: number, comments: string, isEdit: boolean }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminTopicComponent, SearchComponent],
      imports: [HttpClientModule, MatPaginatorModule, BrowserAnimationsModule, MatTableModule, MatSlideToggleModule, FormsModule, NoopAnimationsModule, MatSnackBarModule, MatInputModule, MatIconModule, StoreModule.forRoot(reducers)],
      providers: [{provide: AppServiceService, useClass: MockAppService}, MatPaginator]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTopicComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
    mockAppService = new MockAppService();
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
    let row = {
      categoryId: 1,
      categoryName: "category1",
      categoryStatus: false,
      moduleId: 1,
      moduleName: "module1",
      moduleStatus: false,
      topicId: 1,
      topicName: "topicnew",
      active: false,
      updatedAt: Date.now(),
      comments: "comment",
      isEdit: true,
    }

    jest.spyOn(component, "saveTopic")
    jest.spyOn(component, "getTopicRequest")
    jest.spyOn(component, "isTopicUnique")
    jest.spyOn(component, "setTopicRequest")
    jest.spyOn(component, "showError")
    component.ngOnInit()

    component.moduleList = [{moduleId: 1, moduleName: "module1", active: true}, {
      moduleId: 2,
      moduleName: "module2",
      active: true
    }]

    component.saveTopic(row)

    expect(component.showError).toHaveBeenCalled()
  });

  it("should update topic", () => {
    let topicRequest = {comments: "comment", module: 1, topicName: "new topic", active: true}


    mockAppService.updateTopic(topicRequest, -1).subscribe((data) => {
      expect(component.sendToStore(data)).toHaveBeenCalled()
      expect(data).toBe(topicRequest)
    })
  });

  it("should throw error while updating topic", () => {
    let topicRequest = {comments: "comment", module: 1, topicName: "new topic", active: true}
    row = {
      categoryId: 1,
      categoryName: "category1",
      categoryStatus: false,
      moduleId: 1,
      moduleName: "module1",
      moduleStatus: false,
      topicId: 1,
      topicName: "topicnew",
      active: false,
      updatedAt: Date.now(),
      comments: "",
      isEdit: true,
    }
    jest.spyOn(component, "showError")
    component.ngOnInit()
    component.moduleList = [{moduleId: 1, moduleName: "module1", active: true}, {
      moduleId: 2,
      moduleName: "module2",
      active: true
    }]
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
    let row: TopicData = {
      active: false,
      categoryId: 1,
      categoryName: "category1",
      categoryStatus: false,
      comments: "",
      moduleId: 1,
      moduleName: "module1",
      moduleStatus: false,
      topicId: -1,
      topicName: "new topic",
      updatedAt: 0
    }
    component.ngOnInit()
    component.dataSource.data.push(row)

    component.deleteAddedTopicRow()

    expect(component.dataSource.data.length).toBe(2)
  });

  it("should save new topics", () => {
    let row: TopicData = {
      active: false,
      categoryId: 1,
      categoryName: "category1",
      categoryStatus: false,
      comments: "",
      moduleId: 1,
      moduleName: "module1",
      moduleStatus: false,
      topicId: -1,
      topicName: "new topic",
      updatedAt: 0
    }

    jest.spyOn(component, "saveTopic")
    jest.spyOn(component, "getTopicRequest")
    jest.spyOn(component, "isTopicUnique")
    jest.spyOn(component, "setTopicRequest")

    component.moduleList = [{moduleId: 1, moduleName: "module1", active: true}, {
      moduleId: 2,
      moduleName: "module2",
      active: true
    }]
    component.isEditable = true
    component.ngOnInit()
    component.saveTopic(row)

    let data = {"active": false, "comments": "", "module": 1, "topicName": "new topic"}

    expect(component.getTopicRequest(row)).toStrictEqual(data)
    expect(component.isEditable).toBeFalsy()
  });

  it("should show error when saving the topic already exists", () => {
    let row: TopicData = {
      active: false,
      categoryId: 2,
      categoryName: "category1",
      categoryStatus: false,
      comments: "",
      moduleId: 2,
      moduleName: "module1",
      moduleStatus: false,
      topicId: -1,
      topicName: "topic1",
      updatedAt: 0
    }

    jest.spyOn(component, "saveTopic")
    jest.spyOn(component, "getTopicRequest")
    jest.spyOn(component, "isTopicUnique")
    jest.spyOn(component, "showError")

    component.moduleList = [{moduleId: 1, moduleName: "module1", active: true}, {
      moduleId: 2,
      moduleName: "module2",
      active: true
    }]
    component.isEditable = true
    component.ngOnInit()
    component.saveTopic(row)

    expect(component.getTopicRequest(row)).toBeNull()
    expect(component.showError).toHaveBeenCalled()
  });

  it("should update topic", () => {

    let row: TopicData = {
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

    component.moduleList = [{moduleId: 1, moduleName: "module1", active: true}, {
      moduleId: 2,
      moduleName: "module2",
      active: true
    }]
    component.isEditable = true
    component.unsavedTopic = row1

    component.updateTopic(row)

    expect(component.getTopicRequest(row)).toBeDefined()
  });

  it("should shortlist module according to category name", () => {

    component.ngOnInit()

    component.shortlistModule(row)

    expect(component.moduleList.length).toBe(1)
  });

  it("should display no modules available when no module is available in the selected category", () => {
    let row: TopicData = {
      active: false,
      categoryId: 1,
      categoryName: "category3",
      categoryStatus: false,
      comments: "",
      moduleId: 1,
      moduleName: "module1",
      moduleStatus: false,
      topicId: -1,
      topicName: "topic new",
      updatedAt: 0
    }

    component.ngOnInit()
    component.shortlistModule(row)

    expect(component.moduleList.length).toBe(1)
    expect(component.moduleList[0].moduleName).toBe("No modules available")
  });

  it("should cancel update topic", () => {

    let row: TopicData = {
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
});
