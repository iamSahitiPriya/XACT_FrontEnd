/*
 *  Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminModuleComponent} from './admin-module.component';
import {HttpClientModule} from "@angular/common/http";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatTableModule} from "@angular/material/table";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {FormsModule} from "@angular/forms";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatInputModule} from "@angular/material/input";
import {SearchComponent} from "../../search-component/search.component";
import {CategoryResponse} from "../../../types/categoryResponse";
import {Observable, of, throwError} from "rxjs";
import {ModuleStructure} from "../../../types/moduleStructure";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../../reducers/reducers";
import {ModuleRequest} from "../../../types/Admin/moduleRequest";
import {ModuleResponse} from "../../../types/Admin/moduleResponse";
import {ModuleData} from "../../../types/moduleData";


class MockAppService {
  moduleResponse:ModuleStructure[]=[{
    "moduleId": -1,
    "moduleName":"moduleName",
    "category": -1,
    "active":true,
    "updatedAt" : 1033033,
    "comments" : "comments",
    "topics": []
  }]
  category: CategoryResponse[] =
    [{
      "modules": this.moduleResponse,
      "categoryName" : "category1",
      "comments" : "comments",
      "categoryId" : 1,
      "updatedAt" : 1022022,
      "active": true
    },{
      "modules":this.moduleResponse,
      "categoryName" : "category2",
      "comments" : "comments",
      "categoryId" : 2,
      "updatedAt" : 1022022,
      "active": true
    }]

  public getAllCategories() : Observable<CategoryResponse[]> {
    return of(this.category);
  }
  public saveModule(moduleRequest:ModuleRequest):Observable<ModuleResponse>{
    let moduleResponse : ModuleResponse = {moduleId:moduleRequest.category,moduleName:moduleRequest.moduleName,comments:moduleRequest.comments,categoryId:1,active:moduleRequest.active,updatedAt:12345}
    if(moduleRequest.moduleName === "module"){
      return of(moduleResponse)
    }
    else{
      return throwError("Error!")
    }
  }
  public updateModule(moduleRequest:ModuleRequest):Observable<ModuleResponse>{
    let moduleResponse : ModuleResponse = {moduleId:moduleRequest.category,moduleName:moduleRequest.moduleName,comments:moduleRequest.comments,categoryId:1,active:moduleRequest.active,updatedAt:12345}
    if(moduleRequest.comments !== "comments to be edited")
      return of(moduleResponse)
    else
      return throwError("Error")
  }


}
describe('AdminModuleComponent', () => {
  let component: AdminModuleComponent;
  let fixture: ComponentFixture<AdminModuleComponent>;
  let mockAppService: MockAppService
  let row : ModuleData
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminModuleComponent,SearchComponent  ],
      imports:[HttpClientModule, MatPaginatorModule, BrowserAnimationsModule, MatTableModule,MatSlideToggleModule,FormsModule,NoopAnimationsModule, MatSnackBarModule,MatInputModule,StoreModule.forRoot(reducers)],
      providers: [{provide: AppServiceService, useClass: MockAppService},MatPaginator]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockAppService = new MockAppService();
    row = {
      active: true, moduleId: -1, categoryName: "category",moduleName:"module", comments: "comments", updatedAt: 1022022, categoryId:1, categoryStatus : true
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

  it('should get master data', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.moduleStructure[0].categoryName).toBe("category1");
    expect(component.moduleStructure[0].moduleName).toBe("module1");
  });

  it("should add a row to the table", () => {
    component.moduleStructure = [{
      "moduleId":-1,
      "moduleName":"moduleName",
      "categoryName" :"category1",
      "categoryId":-1,
      "categoryStatus": true,
      "active" : true,
      "updatedAt" :  1022022,
      "comments" : "some comments",
    }]
    component.paginator.pageSize = 5
    component.paginator.pageIndex = 0
    component.ngOnInit()
    expect(component.dataSource).toBeTruthy()
    expect(component.isModuleAdded).toBeFalsy();
    component.addModuleRow()
    expect(component.isModuleAdded).toBeTruthy()
  });

  it("should delete row from the table on clicking the bin button", () => {
    component.ngOnInit()
    component.deleteRow()
    expect(component.dataSource.data.length).toBe(0)
  });
  it("should save module", () => {
    let moduleRequest  : ModuleRequest= {
      category: 1,
      moduleName:"module",
      active: false,
      comments: "comments"
    }
    component.categoryDetails=[{
      "modules": [],
      "categoryName" : "category1",
      "comments" : "comments",
      "categoryId" : 1,
      "updatedAt" : 1022022,
      "active": true
    },{
      "modules":[],
      "categoryName" : "category2",
      "comments" : "comments",
      "categoryId" : 2,
      "updatedAt" : 1022022,
      "active": true
    }]
    let row : ModuleData = {
      active: true, moduleId: -1, categoryName: "category1",moduleName:"module", comments: "comments", updatedAt: 1022022,categoryId:1,categoryStatus:true
    }
    jest.spyOn(component,"sendDataToStore")
    component.saveModule(row)
    mockAppService.saveModule(moduleRequest).subscribe(data =>{
      expect(data).toBe(moduleRequest)
      expect(component.sendDataToStore).toHaveBeenCalled()
    })
  });
  it("should select category on clicking edit", () => {
    component.selectedModule= null
    component.isEditable = false
    component.editRow(row)
    expect(component.isEditable).toBeTruthy()
    expect(component.selectedModule).toBe(row)
  });
  it("should update module on click of update", () => {
    component.selectedModule= {
      active: false,
      categoryName: "newCategory",
      categoryStatus: false,
      comments: "Comments",
      categoryId:-1,
      moduleId: 0,
      moduleName: "ModuleName",
      updatedAt: 0
    }
    component.categoryDetails=[{
      "modules": [],
      "categoryName" : "category1",
      "comments" : "comments",
      "categoryId" : 1,
      "updatedAt" : 1022022,
      "active": true
    },{
      "modules":[],
      "categoryName" : "category2",
      "comments" : "comments",
      "categoryId" : 2,
      "updatedAt" : 1022022,
      "active": true
    }]

    let  moduleRequest : ModuleRequest = {moduleName:"module",moduleId:1,category:1,active:true}
    component.module={
      moduleId:1,
      moduleName:"module",
      categoryName : "category1",
      categoryId : 1,
      categoryStatus: true,
      active : true,
      updatedAt : 1022022,
      comments : "",
    };
    component.ngOnInit();
    component.updateModule(row)
    mockAppService.updateModule(moduleRequest).subscribe(data =>{
      expect(data).toBe(row);
    })
    expect(component.selectedModule).toBeDefined()
  });
  it("should cancel changes", () => {
    component.selectedModule = {
      active: false,
      categoryName: "newCategory",
      categoryStatus: false,
      comments: "Comments",
      categoryId:-1,
      moduleId: 0,
      moduleName: "ModuleName",
      updatedAt: 0
    };
    component.module = {
      active: false,
      categoryName: "",
      categoryStatus: false,
      categoryId:-1,
      comments: "",
      moduleId: 0,
      moduleName: "",
      updatedAt: 0
    }
    jest.spyOn(component,"cancelChanges");
    component.cancelChanges(row);
    expect(component.cancelChanges).toHaveBeenCalled()
  });

  it("should show error", () => {
    const message = "This is an error message"
    jest.spyOn(component, "showError")
    component.showError(message)
    expect(component.showError).toHaveBeenCalled()
  });
  it("should throw duplicate error when module is updated with same name", () => {
    component.module={
      moduleId:1,
      moduleName:"moduleName",
      categoryName : "category1",
      categoryId : 1,
      categoryStatus: true,
      active : true,
      updatedAt : 1022022,
      comments : "",
    };

    let  moduleRequest : ModuleRequest = {moduleName:"moduleName",moduleId:1,category:1,active:true}

    component.ngOnInit();
    component.updateModule(row)
    mockAppService.updateModule(moduleRequest).subscribe(data =>{
      expect(data).toBe(row);
    })
    expect(component.isModuleUnique).toBeFalsy()
  });

  it("should change the value to lower case while sorting the module table for string valued columns", () => {
    component.moduleStructure = [{
      "categoryName": "category1",
      "categoryId": 1,
      "categoryStatus" : true,
      "moduleName": "MODULE1",
      "moduleId" : 1,
      "comments": "comments",
      "updatedAt": 1022022,
      "active": true
    }, {
      "categoryName": "category2",
      "categoryId": 2,
      "categoryStatus" : true,
      "moduleName": "module2",
      "moduleId" : 2,
      "comments": "comments",
      "updatedAt": 1022022,
      "active": true
    }]

    component.sortModule()

    let expectedResponse = component.dataSource.sortingDataAccessor(component.moduleStructure[0],'moduleName');

    expect(expectedResponse).toBe("module1")
  });

  it("should return the same value while sorting the module table for other column types than string", () => {
    component.moduleStructure = [{
      "categoryName": "category1",
      "categoryId": 1,
      "categoryStatus" : true,
      "moduleName": "MODULE1",
      "moduleId" : 1,
      "comments": "comments",
      "updatedAt": 1022022,
      "active": true
    }, {
      "categoryName": "category2",
      "categoryId": 2,
      "categoryStatus" : true,
      "moduleName": "module2",
      "moduleId" : 2,
      "comments": "comments",
      "updatedAt": 1022022,
      "active": true
    }]

    component.sortModule()

    let expectedResponse = component.dataSource.sortingDataAccessor(component.moduleStructure[0],'active');

    expect(expectedResponse).toBe(true)
  });

  it("should throw error when there is a problem while updating module", () => {
    jest.spyOn(component,"showError")
    component.ngOnInit()
    component.categoryDetails = [{"categoryId": 2,"categoryName": "category2",active:true,updatedAt:12345,modules:[]}]
    component.module = { "categoryName": "category1", "categoryId": 1, "categoryStatus" : true, "moduleName": "MODULE1", "moduleId" : 1, "comments": "comments", "updatedAt": 1022022, "active": true}
    let row = {"categoryName": "category2", "categoryId": 2, "categoryStatus" : true, "moduleName": "module2", "moduleId" : 2, "comments": "comments to be edited", "updatedAt": 1022022, "active": true}

    component.updateModule(row)

    expect(component.showError).toHaveBeenCalled()
  });

  it("should thrRow error when there is a problem while saving module", () => {
    jest.spyOn(component,"showError")
    component.ngOnInit()
    component.categoryDetails = [{"categoryId": 2,"categoryName": "category2",active:true,updatedAt:12345,modules:[]}]
    component.module = { "categoryName": "category1", "categoryId": 1, "categoryStatus" : true, "moduleName": "MODULE1", "moduleId" : 1, "comments": "comments", "updatedAt": 1022022, "active": true}
    let row = {"categoryName": "category2", "categoryId": 2, "categoryStatus" : true, "moduleName": "module2", "moduleId" : 2, "comments": "comments to be edited", "updatedAt": 1022022, "active": true}

    component.saveModule(row)

    expect(component.showError).toHaveBeenCalled()
  });


  it("should reset unsaved changes", () => {
    component.ngOnInit()
    component.module={moduleId:1, moduleName:"moduleName123", categoryName : "category1", categoryId : 1, categoryStatus: true, active : true, updatedAt : 1022022, comments : "",};

    component.editRow(row)

    expect(component.dataSource.data[0].moduleName).toBe("moduleName123")
  });
});

