import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminModuleComponent } from './admin-module.component';
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
  moduleRequest = {
    "categoryName": "categoryName",
    "moduleName":"moduleName",
    "active": false,
    "comments": "comments"
  }

  public getAllCategories() : Observable<CategoryResponse[]> {
    return of(this.category);
  }
  public saveModule(moduleRequest:any):Observable<any>{
    if(moduleRequest.moduleName === "module"){
      return of(moduleRequest)
    }
    else{
      return throwError("Error!")
    }
  }
  public updateModule(moduleRequest:any):Observable<any>{
    return of(moduleRequest)
  }


}
describe('AdminModuleComponent', () => {
  let component: AdminModuleComponent;
  let fixture: ComponentFixture<AdminModuleComponent>;
  let mockAppService: MockAppService
  let row: { active: boolean; moduleId: number; categoryName: string; moduleName : string;comments: string; updatedAt: number; }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminModuleComponent,SearchComponent  ],
      imports:[HttpClientModule, MatPaginatorModule, BrowserAnimationsModule, MatTableModule,MatSlideToggleModule,FormsModule,NoopAnimationsModule, MatSnackBarModule,MatInputModule],
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
      active: true, moduleId: -1, categoryName: "category",moduleName:"module", comments: "comments", updatedAt: 1022022
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get master data', () => {
    let module : ModuleData[]=[{
      "moduleId":-1,
      "moduleName":"moduleName",
      "categoryName" :"category1",
      "categoryStatus": true,
      "categoryId":-1,
      "active" : true,
      "updatedAt" :  1022022,
      "comments" : "some comments",
    }]
    expect(component).toBeTruthy();
    mockAppService.getAllCategories().subscribe((data) => {
      expect(data).toBe(module)
    })
    expect(component.moduleStructure[0].categoryName).toBe("category1");
    expect(component.moduleStructure[0].moduleName).toBe("moduleName");
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
    component.deleteRow()
    expect(component.dataSource.data.length).toBe(1)
  });
  it("should save module", () => {
    let moduleRequest = of({
      "categoryName": "category1",
      "moduleName":"module",
      "active": false,
      "comments": "comments"
    })
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
    let row= {
      active: true, moduleId: -1, categoryName: "category1",moduleName:"module", comments: "comments", updatedAt: 1022022
    }
    component.saveModule(row)
    mockAppService.saveModule(moduleRequest).subscribe(data =>{
      expect(data).toBe(moduleRequest)
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
    let row= {
      active: true, moduleId: -1, categoryName: "category1",moduleName:"module", comments: "comments", updatedAt: 1022022
    }

    component.updateModule(row)
    mockAppService.updateModule(row).subscribe(data =>{
      expect(data).toBe(row);
    })
    expect(component.selectedModule).toBeNull()
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
    component.showError(message,"close")
    expect(component.showError).toHaveBeenCalled()
  });
});

