/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminCategoryComponent} from './admin-category.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {CategoryData} from "../../../types/category";
import {CategoryResponse} from "../../../types/categoryResponse";
import {Observable, of, throwError} from "rxjs";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatTableModule} from "@angular/material/table";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {SearchComponent} from "../../search-component/search.component";
import {MatInputModule} from "@angular/material/input";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../../reducers/reducers";
import {CategoryRequest} from "../../../types/Admin/categoryRequest";

class MockAppService {
  category: CategoryResponse[] =
    [{
      "modules": [],
      "categoryName": "category1",
      "comments": "comments",
      "categoryId": -1,
      "updatedAt": 1022022,
      "active": true
    }, {
      "modules": [],
      "categoryName": "category2",
      "comments": "comments",
      "categoryId": -2,
      "updatedAt": 1022022,
      "active": true
    }]
  categoryRequest = {
    "categoryName": "value.categoryName",
    "active": false,
    "comments": "value.comments"
  }

  public getAllCategories(): Observable<CategoryResponse[]> {
    return of(this.category);
  }

  public saveCategory(categoryRequest: CategoryRequest): Observable<CategoryResponse> {
    let categoryResponse : CategoryResponse = {categoryId:1,categoryName:categoryRequest.categoryName,comments:categoryRequest.comments,active:categoryRequest.active,updatedAt:12345,modules:[]}
    if(categoryRequest.comments !== "comment to be added")
      return of(categoryResponse)
    else
      return throwError("Error!")

  }
  public updateCategory(categoryRequest:CategoryData):Observable<CategoryResponse>{
    let categoryResponse : CategoryResponse = {categoryId:categoryRequest.categoryId,categoryName:categoryRequest.categoryName,comments:categoryRequest.comments,active:categoryRequest.active,updatedAt:12345,modules:[]}
    if(categoryRequest.categoryName !="") {
      return of(categoryResponse)
    }
    else {
      return throwError("Error !")
    }
  }


}

describe('AdminCategoryComponent', () => {
  let component: AdminCategoryComponent;
  let fixture: ComponentFixture<AdminCategoryComponent>;
  let mockAppService: MockAppService
  let row: { active: boolean; categoryId: number; categoryName: string; comments: string; updatedAt: number; }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminCategoryComponent, SearchComponent],
      imports: [HttpClientModule, MatPaginatorModule, BrowserAnimationsModule, MatTableModule, MatSlideToggleModule, FormsModule, NoopAnimationsModule, MatSnackBarModule, MatInputModule,
        StoreModule.forRoot(reducers)],
      providers: [{provide: AppServiceService, useClass: MockAppService}, MatPaginator]
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
    component.masterData = of([{
      "modules": [],
      "categoryName": "category1",
      "comments": "comments",
      "categoryId": 1,
      "updatedAt": 1022022,
      "active": true
    }, {
      "modules": [],
      "categoryName": "category2",
      "comments": "comments",
      "categoryId": 2,
      "updatedAt": 1022022,
      "active": true
    }])

    let categoryData : CategoryData = {
      categoryName: "value1",
      active: false,
      comments: "value.comments",
      categoryId : 1,
      updatedAt:12345
    }

    component.categoryData = [{
      "categoryName": "category1",
      "comments": "comments",
      "categoryId": 1,
      "updatedAt": 1022022,
      "active": true
    }, {
      "categoryName": "category2",
      "comments": "comments",
      "categoryId": 2,
      "updatedAt": 1022022,
      "active": true
    }]

    component.category ={
      active: true, categoryId: 1, categoryName: "category", comments: "comments", updatedAt: 1022022
    }
  });

  it('should create', () => {
    component.ngOnInit()
    expect(component).toBeTruthy();
  });

  it('should get all categories', () => {
    component.ngOnInit()
    let category: CategoryData[] =
      [{"active": true, "categoryId": -1, "categoryName": "category1", "comments": "comments", "updatedAt": 1022022}]

    expect(component).toBeTruthy();
    mockAppService.getAllCategories().subscribe((data) => {
      expect(data).toBe(category)
    })
    expect(component.categoryData[0].categoryName).toBe("category1");
  });
  it("should add a row to the table", () => {
    component.paginator.pageSize = 5
    component.paginator.pageIndex = 0

    component.ngOnInit()
    expect(component.dataSource).toBeTruthy()
    expect(component.isCategoryAdded).toBeFalsy();

    component.addCategoryRow()
    expect(component.isCategoryAdded).toBeTruthy()
  });
  it("should delete row from the table on clicking the bin button", () => {
    component.ngOnInit()
    component.dataSource.data = [{ active: true, categoryId: -1, categoryName: "category", comments: "comments", updatedAt: 1022022}]
    component.deleteRow()

    expect(component.selectedCategory).toBeNull()
    expect(component.dataSource.data.length).toBe(0)
  });

  it("should save categories", () => {
    component.ngOnInit()
    component.isEditable = true

    component.saveCategory(row)

    expect(component.isEditable).toBeFalsy();
  });

  it("should throw error when there is a problem while saving category", () => {
    jest.spyOn(component,"showError")
    component.ngOnInit()
    component.isEditable = true
    let row : CategoryData = {
      categoryName: "value1",
      active: false,
      comments: "comment to be added",
      categoryId : 1,
      updatedAt:12345
    }

    component.saveCategory(row)

    expect(component.showError).toHaveBeenCalled()
  });
  it("should select category on clicking edit", () => {
    component.selectedCategory = null
    component.isEditable = false
    component.dataSource.data = [{
      active: true, categoryId: 1, categoryName: "category", comments: "comments", updatedAt: 1022022
    }]

    component.editCategory(row)

    expect(component.isEditable).toBeTruthy()
    expect(component.selectedCategory).toBe(row)
  });
  it("should update category on click of update", () => {
    component.selectedCategory = row

    component.updateCategory(row)

    mockAppService.updateCategory(row).subscribe(data => {
      expect(data).toBe(row);
    })
    expect(component.selectedCategory).toBeNull()
  })

    it('should not update category and throw error on click of update', () => {
      component.selectedCategory = row
      jest.spyOn(component, 'updateCategory')

      let data = {active: true, categoryId: -1, categoryName: "", comments: "comments", updatedAt: 1022022}
      component.updateCategory(data)

      jest.spyOn(component, 'showError')
      mockAppService.updateCategory(data).subscribe(data => {
          expect(data).toBeUndefined()
        },
        error => {
          expect(component.showError).toHaveBeenCalled()
          expect(error).toBe(new Error("Error!"))
        })

    })

    it("should cancel changes", () => {
      component.selectedCategory = row;

      component.cancelChanges(row);

      expect(component.selectedCategory).toBe(null)
    });
    it("should show error", () => {
      const message = "This is an error message"
      jest.spyOn(component, "showError")
      component.showError(message)
      expect(component.showError).toHaveBeenCalled()
    });
    it("should throw error if the category is already present", () => {
      component.ngOnInit()
      component.isEditable = true
      let dummyCategoryReq : CategoryData = {
        categoryName: "category2",
        comments: "comments",
        categoryId: -1,
        active: true,
        updatedAt:12345
      }
      jest.spyOn(component, "showError")
      component.saveCategory(dummyCategoryReq)
      jest.spyOn(component, "showError")
      expect(component.showError).toHaveBeenCalled();
    });
    it("should update data to store", () => {
      component.ngOnInit()
      jest.spyOn(component, 'updateToStore')
      let category : CategoryResponse = {
        active: false,
        categoryId: 2,
        categoryName: "adasdasd",
        updatedAt: 1669185488599,
        comments: "this is a comment",
        modules:[]
      }
      component.updateToStore(category)
      expect(component.updateToStore).toHaveBeenCalled()
    });

  it("should change the value to lower case while sorting the table for string valued columns", () => {

    component.sortCategory()

    let expectedResponse = component.dataSource.sortingDataAccessor(component.categoryData[0],'categoryName');

    expect(expectedResponse).toBe("category1")
  });

  it("should return the same value while sorting the table for other column types than string", () => {
    component.sortCategory()

    let expectedResponse = component.dataSource.sortingDataAccessor(component.categoryData[0],'active');

    expect(expectedResponse).toBe(true)
  });

  });
