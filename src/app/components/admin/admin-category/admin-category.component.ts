/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {CategoryData} from "../../../types/category";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {AssessmentStructure} from "../../../types/assessmentStructure";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Observable, Subject, takeUntil} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {data_local} from "../../../messages";
import {NotificationSnackbarComponent} from "../../notification-component/notification-component.component";
import {CategoryResponse} from "../../../types/categoryResponse";
import {Store} from "@ngrx/store";
import {AppStates} from "../../../reducers/app.states";
import * as fromActions from "../../../actions/assessment-data.actions"


@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '100px'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class AdminCategoryComponent implements OnInit, OnDestroy {
  masterData: Observable<CategoryResponse[]>
  categoryData: CategoryData[]
  categories: CategoryResponse[]
  displayedColumns: string[] = ['categoryName', 'updatedAt', 'active', 'edit', 'action'];
  commonErrorFieldText = data_local.ASSESSMENT.ERROR_MESSAGE_TEXT;
  displayColumns: string[] = [...this.displayedColumns, 'expand'];
  dataSource: MatTableDataSource<CategoryData>;

  private destroy$: Subject<void> = new Subject<void>();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<CategoryData>
  AssessmentStructure: AssessmentStructure;
  dataSourceArray: CategoryData[]
  isCategoryAdded: boolean = false;
  category: CategoryData
  selectedCategory: CategoryData | null;
  isEditable: boolean;
  dataToDisplayed: CategoryData[]
  isCategoryUnique = true;
  duplicateErrorMessage = data_local.ADMIN.CATEGORY.DUPLICATE_CATEGORY_ERROR_MESSAGE
  serverErrorMessage = data_local.ADMIN.SERVER_ERROR_MESSAGE
  updateSuccessMessage = data_local.ADMIN.UPDATE_SUCCESSFUL_MESSAGE
  date = data_local.ADMIN.DATE
  active = data_local.ADMIN.ACTIVE
  action = data_local.ADMIN.ACTION
  edit = data_local.ADMIN.EDIT
  save = data_local.ADMIN.SAVE
  update = data_local.ADMIN.UPDATE
  categoryLabel = data_local.ADMIN.CATEGORY.CATEGORY
  addCategory = data_local.ADMIN.CATEGORY.ADD_CATEGORY
  dataNotFound = data_local.ADMIN.DATA_NOT_FOUND;


  constructor(private appService: AppServiceService, private _snackbar: MatSnackBar, private store: Store<AppStates>) {
    this.masterData = this.store.select((storeMap) => storeMap.masterData.masterData)
    this.categoryData = []
    this.dataSource = new MatTableDataSource<CategoryData>(this.categoryData)
    this.dataToDisplayed = [...this.dataSource.data]

  }

  ngOnInit(): void {
    this.masterData.subscribe(data => {
      this.categories = data
      data.forEach((eachCategory) => {
        let category: CategoryData = {
          categoryId: -1,
          categoryName: "",
          active: true,
          updatedAt: -1,
          comments: ""
        }
        category.categoryId = eachCategory.categoryId;
        category.categoryName = eachCategory.categoryName;
        category.active = eachCategory.active;
        category.updatedAt = eachCategory.updatedAt;
        category.comments = eachCategory.comments;
        this.categoryData.push(category)
      })
      this.sortCategory();
    })
  }

  private sortCategory() {
    this.categoryData.sort((category1, category2) => category2.updatedAt - category1.updatedAt)
    this.dataSource = new MatTableDataSource<CategoryData>(this.categoryData)
    this.dataSourceArray = [...this.dataSource.data]
    this.paginator.pageIndex = 0
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  addCategoryRow() {
    this.deleteRow()
    let newCategory = {
      categoryId: -1, categoryName: '', active: true, updatedAt: Date.now(), isEdit: true, comments: ''
    }
    this.dataSource.data.splice(this.paginator.pageIndex * this.paginator.pageSize, 0, newCategory)
    this.table.renderRows();
    this.selectedCategory = this.selectedCategory === newCategory ? null : newCategory
    this.dataSource.paginator = this.paginator
    this.isCategoryAdded = true

  }

  deleteRow() {
    let data = this.dataSource.data
    let categoryIndex = data.findIndex(category => category.categoryId === -1)
    if (categoryIndex !== -1) {
      data.splice(categoryIndex, 1)
      this.dataSource.data = data
      this.selectedCategory = null
      this.table.renderRows()
    }
  }

  showError(message: string) {
    this._snackbar.openFromComponent(NotificationSnackbarComponent, {
      data: {message: message, iconType: "error_outline", notificationType: "Error:"}, panelClass: ['error-snackBar'],
      duration: 2000,
      verticalPosition: "top",
      horizontalPosition: "center"
    })
  }

  saveCategory(value: any) {
    let categoryRequest = this.getCategoryRequest(value)
    if (this.isCategoryUnique) {
      this.appService.saveCategory(categoryRequest).subscribe({
        next: (_data) => {
          let data = this.dataSource.data
          value.isEdit = false
          this.isEditable = false;
          data.splice(this.paginator.pageIndex * this.paginator.pageSize, 1)
          this.dataSource.data = data
          this.table.renderRows()
          this.categoryData = []
          this.sendDataToStore(_data)
          this.ngOnInit()
        }, error: _error => {
          this.showError(this.serverErrorMessage);
        }
      })
    }
  }

  private getCategoryRequest(value: any) {
    let index = this.categoryData.findIndex((category: any) => category.categoryName.toLowerCase().replace(/\s/g, '') === value.categoryName.toLowerCase().replace(/\s/g, ''));
    let categoryRequest:any;
    if (index === -1) {
      this.isCategoryUnique = true;
      categoryRequest = {
        "categoryName": value.categoryName,
        "active": value.active,
        "comments": value.comments
      };
    } else {
      this.isCategoryUnique = false;
      this.showError(this.duplicateErrorMessage)
      return null
    }
    return categoryRequest;
  }

  editCategory(row: any) {
    this.resetUnsavedChanges(row)
    this.deleteRow()
    this.selectedCategory = this.selectedCategory === row ? null : row
    this.isEditable = true;
    this.category = Object.assign({}, row)
    return this.selectedCategory;
  }

  private resetUnsavedChanges(row: any) {
    if (this.category !== undefined && this.category.categoryId !== row.categoryId) {
      let data = this.dataSource.data
      let index = data.findIndex(category => category.categoryId === this.category.categoryId)
      if (index !== -1) {
        data.splice(index, 1, this.category)
        this.dataSource.data = data
      }
    }
  }

  updateCategory(row: any) {
    let categoryRequest :any;
    categoryRequest = this.setCategoryRequest(row);
    if (this.category.categoryName.toLowerCase().replace(/\s/g, '')  !== row.categoryName.toLowerCase().replace(/\s/g, '') ) {
      categoryRequest= this.getCategoryRequest(row);
    }
    if(this.isCategoryUnique) {
      categoryRequest['categoryId']=row.categoryId
      this.appService.updateCategory(row).pipe(takeUntil(this.destroy$)).subscribe({
        next: (_data) => {
          row.isEdit = false;
          this.selectedCategory = null;
          this.table.renderRows()
          this.showNotification(this.updateSuccessMessage, 2000)
          this.categoryData = []
          this.updateToStore(_data)
          this.ngOnInit()
        }, error: _error => {
          this.showError(this.serverErrorMessage);
        }
      })
    }
  }

  private showNotification(reportData: string, duration: number) {
    this._snackbar.openFromComponent(NotificationSnackbarComponent, {
      data: {message: reportData, iconType: "done", notificationType: "Success:"}, panelClass: ['success'],
      duration: duration,
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }

  cancelChanges(row: any) {
    row.categoryName = this.category.categoryName
    row.active = this.category.active
    row.updatedAt = this.category.updatedAt
    row.comments = this.category.comments
    this.selectedCategory = this.selectedCategory === row ? null : row
    return row;
  }

  private sendDataToStore(value: any) {
    value['modules'] = []
    this.categories.push(value)
    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categories}))
  }

  updateToStore(_data: any) {
    let category = this.categories.find(eachCategory => eachCategory.categoryId === _data.categoryId)
    if (category !== undefined) {
      category.categoryName = _data.categoryName
      category.active = _data.active
      category.comments = _data.comments
      category.updatedAt = Number(new Date())
      this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categories}))
    }

  }

  private setCategoryRequest(row: any) {
    this.isCategoryUnique = true;
     let categoryRequest = {
      "categoryName": row.categoryName,
      "active": row.active,
      "comments": row.comments
    };
     return categoryRequest;
  }
}
