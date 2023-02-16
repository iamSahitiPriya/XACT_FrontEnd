import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AdminParameterComponent} from './admin-parameter.component';
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
import {of, throwError} from "rxjs";
import {CategoryResponse} from "../../../types/categoryResponse";
import {MatIconModule} from "@angular/material/icon";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../../reducers/reducers";
import {ParameterData} from 'src/app/types/ParameterData';
import {ParameterStructure} from "../../../types/parameterStructure";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {ParameterRequest} from "../../../types/Admin/parameterRequest";

class MockAppService {
  parameterRequest : ParameterData = {
    active: false,
    categoryId: -1,
    categoryName: "category",
    categoryStatus: false,
    comments: "",
    moduleId: -1,
    moduleName: "module",
    moduleStatus: false,
    parameterId: -1,
    parameterName: "parameter",
    topicId: -1,
    topicName: "topic",
    topicStatus: false,
    updatedAt: 0
  }

  parameter: ParameterStructure[] = [{
    active: false,
    comments: "comments",
    parameterId: -1,
    parameterName: "parameter",
    questions: [],
    references: [],
    topic: -1,
    updatedAt: 1234567,
    userQuestions:[]
  }]


  data : CategoryResponse [] = [{
    "categoryId":1,
    "categoryName":"category1",
    "active": true,
    "updatedAt" : 12345,
    "comments": "comment1",
    "modules": [{
      "moduleId": 1,
      "moduleName": 'module1',
      "category": 1,
      "active": false,
      "updatedAt" : 23456,
      "comments" : " ",
      "topics" : [{
        "topicId": 1,
        "topicName": "topic1",
        "module": 1,
        "active": true,
        "parameters": this.parameter,
        "updatedAt":12345,
        "references": []
      },
        {
          "topicId": 2,
          "topicName": "topic2",
          "module": 1,
          "active": true,
          "updatedAt":12345,
          "parameters": this.parameter,
          "references": []
        } ]
    }]
  }, {"categoryId":2,
      "categoryName":"category2",
      "active": false,
      "updatedAt" : 12345,
      "comments": "comment2",
      "modules": []
  },
    {
      "categoryId": 3,
      "categoryName": "category3",
      "active": false,
      "updatedAt": 12345,
      "comments": "comment3",
      "modules": [{
        "moduleId": 1,
        "moduleName": 'module1',
        "category": 1,
        "active": false,
        "updatedAt": 23456,
        "comments": " ",
        "topics": []
      }]
    }]

  parameterResponse = {
    categoryId: 1,
    moduleId: 1,
    topicId: 1,
    parameterId: 1,
    parameterName: "parameter",
    active: false,
    updatedAt: Date.now(),
    comments: "",
  }


  saveParameter(parameterRequest : ParameterRequest) {
    if(parameterRequest.parameterName === "parameterName") {
      return of(parameterRequest) }
    else {
      return throwError("Error!")
    }
  }

  updateParameter(row : ParameterData, parameterId : number) {
    if(parameterId === -1) {
      return of(this.parameterResponse) }
    else {
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


describe('AdminParameterComponent', () => {
  let component: AdminParameterComponent;
  let fixture: ComponentFixture<AdminParameterComponent>;
  let mockAppService: MockAppService
  let matDialog : any
  let row: ParameterData
  let rowToBeSaved : ParameterData
  let parameter: ParameterData
  let categoryData : CategoryResponse[]
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminParameterComponent, SearchComponent],
      imports: [HttpClientModule, MatPaginatorModule, BrowserAnimationsModule, MatTableModule, MatSlideToggleModule, FormsModule, NoopAnimationsModule, MatSnackBarModule, MatInputModule, MatIconModule, StoreModule.forRoot(reducers), MatDialogModule],
      providers: [{provide: AppServiceService, useClass: MockAppService}, MatPaginator,{provide: MatDialog, useClass: MockDialog}],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminParameterComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
    matDialog = fixture.debugElement.injector.get(MatDialog)
    mockAppService = new MockAppService();
    row = {
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

    parameter = {
      active: false,
      categoryId: -1,
      categoryName: "category1",
      categoryStatus: false,
      comments: "",
      moduleId: -1,
      moduleName: "module1",
      moduleStatus: false,
      parameterId: -1,
      parameterName: "parameter",
      topicId: -1,
      topicName: "topic1",
      topicStatus: false,
      updatedAt: 0
    }
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
            "parameterId":1,
            "parameterName":"parameter",
            "topic":1,
            "updatedAt": 1234,
            "comments": "",
            "active": true,
            "questions":[],
            "references":[],
            "userQuestions":[]
          }],
          "references": []
        }, {
          "topicId": 3,
          "topicName": "topic2",
          "module": 1,
          "updatedAt": 45678,
          "comments": "",
          "active": false,
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
          "topics":[]
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

    component.topicList = [{"topicId": 1, "topicName": "topic1", "active": true,"module":1},
      {"topicId": 2, "topicName": "topic2", "active": false,"module":2}]

    component.categoryList = [{
      "categoryId": 1,
      "categoryName": "category1",
      "active": true,
    }, {
      "categoryId": 2,
      "categoryName": "category2",
      "active": false
    }]

    component.moduleList = [{"moduleId": 1, "moduleName": "module1", "active": true,"category":1},
      {"moduleId": 2, "moduleName": "module2", "active": false,"category":3}]


    component.parameterData = [{
      "categoryName": "category1",
      "categoryId": 1,
      "categoryStatus" : true,
      "moduleName": "MODULE1",
      "moduleId" : 1,
      "moduleStatus":true,
      "topicId" : 1,
      "topicName" : "topic1",
      "topicStatus" : true,
      "parameterId" : 1,
      "parameterName" : "PARAMETER1",
      "comments": "comments",
      "updatedAt": 1022022,
      "active": true
    }]

    rowToBeSaved = {categoryId: 1,
      categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", topicStatus: false, parameterId: -1, parameterName: "parameterName", active: false, updatedAt: Date.now(), comments: "",}

    categoryData = [{
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
          "references" : [],
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
          }]},{
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
  });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

  it("should get parameter data", () => {
    component.ngOnInit()
    expect(component.parameterData[0].parameterName).toBe("PARAMETER1")
  });

  it('should get master data', () => {

    component.ngOnInit();
    expect(component.parameterData[0].categoryName).toBe("category1");
    expect(component.parameterData[0].moduleName).toBe("MODULE1");
    expect(component.parameterData[0].topicName).toBe("topic1");
    expect(component.parameterData[0].parameterName).toBe("PARAMETER1");
  });

  it("should add a row to the table", () => {
    component.parameter = parameter

    component.ngOnInit()
    expect(component.isParameterAdded).toBeFalsy();

    component.addParameterRow()
    expect(component.isParameterAdded).toBeTruthy()
  });

  it("should cancel changes", () => {

    component.parameter = parameter
    component.unSavedParameter = row
    jest.spyOn(component,"cancelChanges");
    component.cancelChanges(row);
    expect(component.cancelChanges).toHaveBeenCalled()
  });

  it("should save parameter", () => {
    component.isParameterUnique = true

    jest.spyOn(component, "saveParameterRow")
    jest.spyOn(component,"ngOnInit")
    component.ngOnInit();
    component.saveParameterRow(rowToBeSaved)
    let parameterRequest : ParameterRequest = {parameterName:"name",active:false,topic:1}

    mockAppService.saveParameter(parameterRequest).subscribe(data =>{
      expect(data).toBe(parameterRequest)
    })

    expect(component.saveParameterRow).toHaveBeenCalled()
    expect(component.ngOnInit).toHaveBeenCalled()
  });

  it("should not save parameter if name is not unique", () => {
    let parameterRequest : ParameterRequest = {parameterName:"name",topic:1,active:true}
    component.isParameterUnique = true
    component.ngOnInit();
    jest.spyOn(component, "saveParameterRow")
    component.saveParameterRow(row)

    mockAppService.saveParameter(parameterRequest).subscribe(data =>{
      expect(data).toBe(throwError("Error!"))
    })

    expect(component.isParameterUnique).toBeFalsy()
    expect(component.saveParameterRow).toHaveBeenCalled()
  });

  it("should throw error when problem occurs while saving parameter when request is undefined", () => {
    let parameterRequest : ParameterRequest = {parameterName:"name",active:true,topic:2}

    component.isParameterUnique = true

    jest.spyOn(component, "saveParameterRow")
    component.ngOnInit()
    component.saveParameterRow(rowToBeSaved)

    mockAppService.saveParameter(parameterRequest).subscribe(data =>{
      expect(data).toBe(undefined)
    })

    expect(component.saveParameterRow).toHaveBeenCalled()

  });

  it("should select parameter on clicking edit", () => {
    component.selectedParameter = null
    component.isEditable = false
    component.unSavedParameter = row
     component.ngOnInit()
    component.editParameterRow(row)
    expect(component.isEditable).toBeTruthy()
    expect(component.selectedParameter).toBe(row)

  });
  it("should reset the values from unsaved changes", () => {
    component.selectedParameter = null
    component.isEditable = false
    component.unSavedParameter = row
    component.unSavedParameter.parameterId=1
    component.ngOnInit()
     component.resetUnsavedChanges(rowToBeSaved)
    component.editParameterRow(row)
    expect(component.isEditable).toBeTruthy()
    expect(component.selectedParameter).toBe(row)

  });

  it("should delete row from the table on clicking the bin button", () => {
    component.ngOnInit()
    component.dataSource.data = [{categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", topicStatus: false, parameterId: -1, parameterName: "parameter", active: true, updatedAt: Date.now(), comments: "",}]
    component.addParameterRow()
    component.deleteAddedParameterRow()
    expect(component.dataSource.data.length).toBe(0)
  });

  it("should shortlist module when category gets selected", () => {

    jest.spyOn(component, "shortlistModules")
    component.shortlistModules(row)

    expect(component.shortlistModules).toHaveBeenCalled()
    expect(component.moduleList.length).toBe(1)
  })

  it("should not shortlist module when moduleList is undefined", () => {
    let row = {
      categoryId: 1,
      categoryName: "category2",
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

    jest.spyOn(component, "shortlistModules")
    component.shortlistModules(row)

    expect(component.shortlistModules).toHaveBeenCalled()
    expect(component.moduleList[0].moduleName).toBe("No modules available")
  })


  it("should shortlist topic when module gets selected", () => {
    component.ngOnInit();

    jest.spyOn(component, "shortListTopics")
    component.shortListTopics("module1")

    expect(component.shortListTopics).toHaveBeenCalled()
    expect(component.topicList.length).toBe(2)
  })

  it("should not shortlist topic when topicList is undefined", () => {
    component.ngOnInit();

    jest.spyOn(component, "shortListTopics")
    component.shortListTopics("module2")

    expect(component.shortListTopics).toHaveBeenCalled()
    expect(component.topicList[0].topicName).toBe("Topic Not Found")
  })

  it("should update parameter on click of update", () => {

    component.unSavedParameter = row

      let rowToBeUpdated = {
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
      active: true,
      updatedAt: Date.now(),
      comments: "",
    }

    component.updateParameterRow(rowToBeUpdated)
    mockAppService.updateParameter(rowToBeUpdated, rowToBeUpdated.parameterId).subscribe(data =>{
      expect(data).toBe(rowToBeSaved); })
    expect(component.selectedParameter).toBeNull()
  });

  it("should update parameter when parameter name is changed", () => {

    component.unSavedParameter = row
    component.unSavedParameter.parameterId = 1

    component.ngOnInit()
    component.updateParameterRow(rowToBeSaved)
    mockAppService.updateParameter(rowToBeSaved, rowToBeSaved.parameterId).subscribe(data =>{
      expect(data).toBe(rowToBeSaved); })
    expect(component.selectedParameter).toBeNull()
  });

  it("should throw error while trying to update parameter with undefined request ", () => {
   component.unSavedParameter = row

    let rowToBeUpdated = {
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
      active: true,
      updatedAt: Date.now(),
      comments: "",
    }

    component.updateParameterRow(rowToBeUpdated)
    mockAppService.updateParameter(rowToBeUpdated, rowToBeUpdated.parameterId).subscribe(data =>{
      expect(data).toBe(undefined); })
  });

  it("should open reference dialog", () => {
    component.ngOnInit()
    let row = {
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
      parameterName: "parameter1",
      active: false,
      updatedAt: Date.now(),
      comments: "",
    }
    component.categoryData = categoryData

    jest.spyOn(matDialog, "open")

    component.openParameterReference("",row)
    fixture.detectChanges()
    expect(matDialog.open).toHaveBeenCalled()
  });


  it("should show error when the parameter has topic level reference", () => {
    component.ngOnInit()
    let row = {
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
      parameterName: "parameter1",
      active: false,
      updatedAt: Date.now(),
      comments: "",
    }
    component.categoryData = [{
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
            "references": [],
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
    jest.spyOn(component, "showError")

    component.openParameterReference("",row)
    fixture.detectChanges()
    expect(component.showError).toHaveBeenCalled()
  });

  it("should return category id of the selected row", () => {
    let row = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", topicStatus: false, parameterId: -1, parameterName: "parameter1", active: false, updatedAt: Date.now(), comments: "",}
    jest.spyOn(component,"findCategoryId")
    component.ngOnInit()

    expect(component.findCategoryId(row)).toBe(1)
  });

  it("should return module id of the selected row", () => {
    let row = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", topicStatus: false, parameterId: -1, parameterName: "parameter1", active: false, updatedAt: Date.now(), comments: "",}

    jest.spyOn(component,"findModuleId")
    component.ngOnInit()

    expect(component.findModuleId(row)).toBe(1)
  });

  it("should return topic id of the selected row", () => {
    let row = {categoryId: 1, categoryName: "category1", categoryStatus: false, moduleId: 1, moduleName: "module1", moduleStatus: false, topicId: 1, topicName: "topic1", topicStatus: false, parameterId: -1, parameterName: "parameter1", active: false, updatedAt: Date.now(), comments: "",}

    jest.spyOn(component,"findTopicId")
    component.ngOnInit()

    expect(component.findTopicId(row)).toBe(1)
  });

  it("should open question dialog box", () => {
    jest.spyOn(matDialog, "open")

    component.openQuestions("",row)
    fixture.detectChanges()
    expect(matDialog.open).toHaveBeenCalled()
  });

  it("should change the value to lower case while sorting the parameter table for string valued columns", () => {
    component.sortParameter()

    let expectedResponse = component.dataSource.sortingDataAccessor(component.parameterData[0],'parameterName');

    expect(expectedResponse).toBe("parameter1")
  });

  it("should return the same value while sorting the parameter table for other column types than string", () => {
    component.sortParameter()

    let expectedResponse = component.dataSource.sortingDataAccessor(component.parameterData[0],'active');

    expect(expectedResponse).toBe(true)
  });

  it("should throw error when there is a problem while saving parameter", () => {
    component.ngOnInit()

    jest.spyOn(component,"showError")
    row.parameterName = "parameter12new"
    component.saveParameterRow(row)

    expect(component.showError).toHaveBeenCalled()
  });
});


