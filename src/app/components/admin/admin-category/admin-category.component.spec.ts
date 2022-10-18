/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminCategoryComponent} from './admin-category.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {CategoryData} from "../../../types/category";
import {CategoryResponse} from "../../../types/categoryResponse";
import {Observable, of} from "rxjs";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatTableModule} from "@angular/material/table";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {SearchComponent} from "../../search-component/search.component";
import {MatInputModule} from "@angular/material/input";

class MockAppService {
  category: CategoryResponse[] =
    [{
      "modules": [],
      "categoryName" : "category1",
      "comments" : "comments",
      "categoryId" : -1,
      "updatedAt" : 1022022,
      "active": true
    },{
      "modules": [],
      "categoryName" : "category2",
      "comments" : "comments",
      "categoryId" : -2,
      "updatedAt" : 1022022,
      "active": true
    }]
  categoryRequest = {
    "categoryName": "value.categoryName",
    "active": false,
    "comments": "value.comments"
  }

  public getAllCategories() : Observable<CategoryResponse[]> {
    return of(this.category);
  }
  public saveCategory(categoryRequest: Observable<any>):Observable<any>{
    return of(categoryRequest)
  }
  public updateCategory(categoryRequest:any):Observable<any>{
    return of(categoryRequest)
  }


}

describe('AdminCategoryComponent', () => {
  let component: AdminCategoryComponent;
  let fixture: ComponentFixture<AdminCategoryComponent>;
  let mockAppService: MockAppService
  let row: { active: boolean; categoryId: number; categoryName: string; comments: string; updatedAt: number; }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminCategoryComponent,SearchComponent ],
      imports:[HttpClientModule, MatPaginatorModule, BrowserAnimationsModule, MatTableModule,MatSlideToggleModule,FormsModule,NoopAnimationsModule, MatSnackBarModule,MatInputModule],
      providers: [{provide: AppServiceService, useClass: MockAppService},MatPaginator]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCategoryComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges()
    mockAppService = new MockAppService();
    row = {
      active: true, categoryId: -1, categoryName: "category", comments: "comments", updatedAt: 1022022
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get all categories', () => {
    let category: CategoryData[] =
      [{"active": true, "categoryId": -1, "categoryName": "category1", "comments": "comments", "updatedAt": 1022022}]

    expect(component).toBeTruthy();
    mockAppService.getAllCategories().subscribe((data) => {
      expect(data).toBe(category)
    })
    expect(component.categoryData[0].categoryName).toBe("category1");
  });
  it("should add a row to the table", () => {
    component.categoryData = [{
      active: true, categoryId: -1, categoryName: "category", comments: "comments", updatedAt: 1022022
    }]
    component.paginator.pageSize = 5
    component.paginator.pageIndex = 0
    component.ngOnInit()
    expect(component.dataSource).toBeTruthy()
    expect(component.isCategoryAdded).toBeFalsy();
    component.addCategoryRow()
    expect(component.isCategoryAdded).toBeTruthy()
  });
  it("should delete row from the table on clicking the bin button", () => {
    component.deleteRow()
    expect(component.dataSource.data.length).toBe(1)
  });

  it("should save categories", () => {
    component.isEditable = true
    let categoryRequest =of( {
      "categoryName": "value1",
      "active": false,
      "comments": "value.comments"
    })
    component.saveCategory(row)
    mockAppService.saveCategory(categoryRequest).subscribe(data =>{
      expect(data).toBe(categoryRequest)
    })
    expect(component.isEditable).toBeFalsy();
  });
  it("should select category on clicking edit", () => {
    component.selectedCategory = null
    component.isEditable = false
    component.editCategory(row)
    expect(component.isEditable).toBeTruthy()
    expect(component.selectedCategory).toBe(row)
  });
  it("should update category on click of update", () => {
    component.selectedCategory = row
    component.updateCategory(row)
    mockAppService.updateCategory(row).subscribe(data =>{
      expect(data).toBe(row);
    })
    expect(component.selectedCategory).toBeNull()

  });
  it("should cancel changes", () => {
    component.selectedCategory = row;
    component.category = {active: true, categoryId: -1, categoryName: "category", comments: "comments", updatedAt: 1022022}
    component.cancelChanges(row);
    expect(component.selectedCategory).toBe(null)
  });
  it("should show error", () => {
    const message = "This is an error message"
    jest.spyOn(component, "showError")
    component.showError(message,"Close")
    expect(component.showError).toHaveBeenCalled()
  });
  it("should throw error if the category is already present", () => {
    component.isEditable = true
    let categoryRequest =of( {
      categoryName: "value1",
      active: false,
      comments: "value.comments"
    })
    let dummyCategoryReq = {
      "categoryName" : "category2",
      "comments" : "comments",
      "categoryId" : -1,
      "active": true
    }
    jest.spyOn(component, "showError")
    component.saveCategory(dummyCategoryReq)
    jest.spyOn(component, "showError")
    expect(component.showError).toHaveBeenCalled();
  });
});
