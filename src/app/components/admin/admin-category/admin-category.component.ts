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
import {CategoryRequest} from "../../../types/Admin/categoryRequest";


const NOTIFICATION_DURATION = 2000;

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
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<CategoryData>
  AssessmentStructure: AssessmentStructure;
  dataSourceArray: CategoryData[]
  isCategoryAdded: boolean = false;
  category: CategoryData | undefined;
  selectedCategory: CategoryData | null;
  isEditable: boolean;
  dataToDisplayed: CategoryData[]
  duplicateErrorMessage = data_local.ADMIN.DUPLICATE_ERROR_MESSAGE
  serverErrorMessage = data_local.ADMIN.SERVER_ERROR_MESSAGE
  updateSuccessMessage = data_local.ADMIN.UPDATE_SUCCESSFUL_MESSAGE
  date = data_local.ADMIN.DATE
  active = data_local.ADMIN.ACTIVE
  action = data_local.ADMIN.ACTION
  edit = data_local.ADMIN.EDIT
  save = data_local.ADMIN.SAVE
  update = data_local.ADMIN.UPDATE
  categoryLabel = data_local.ADMIN.CATEGORY_NAME
  moduleLabel = data_local.ADMIN.MODULE_NAME
  dataNotFound = data_local.ADMIN.DATA_NOT_FOUND;
  addCategory = data_local.ADMIN.CATEGORY.ADD_CATEGORY
  categoryNamePlaceholder = data_local.ADMIN.CATEGORY.PLACEHOLDER;
  pattern: string = "^[a-zA-Z0-9-()._:&,-]+(\\s+[a-zA-Z0-9-()._:&,-]+)*$";


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
          categoryId: eachCategory.categoryId,
          categoryName: eachCategory.categoryName,
          active: eachCategory.active,
          updatedAt: eachCategory.updatedAt,
          comments: eachCategory.comments
        }
        this.categoryData.push(category)
      })
      this.sortCategory();
    })
  }

  sortCategory() {
    this.categoryData.sort((category1, category2) => category2.updatedAt - category1.updatedAt)
    this.dataSource = new MatTableDataSource<CategoryData>(this.categoryData)

    this.dataSourceArray = [...this.dataSource.data]
    this.paginator.pageIndex = 0
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (tableData: any, sortHeaderId: string): string => {
      if (typeof tableData[sortHeaderId] === 'string') {
        return tableData[sortHeaderId].toLocaleLowerCase();
      }
      return tableData[sortHeaderId];
    };
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
      duration: NOTIFICATION_DURATION,
      verticalPosition: "top",
      horizontalPosition: "center"
    })
  }

  saveCategory(value: CategoryData) {
    let categoryRequest = this.getCategoryRequest(value)
    if (categoryRequest !== null) {
      this.appService.saveCategory(categoryRequest).pipe(takeUntil(this.destroy$)).subscribe({
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

  private isUniqueCategory(categoryName: string): boolean {
    let index = this.categories.findIndex((category: CategoryData) => category.categoryName.toLowerCase().replace(/\s/g, '') === categoryName.toLowerCase().replace(/\s/g, ''));
    return index === -1;
  }

  private getCategoryRequest(value: CategoryData) {
    if (this.isUniqueCategory(value.categoryName)) {
      return this.categoryRequest(value)
    } else {
      this.showError(this.duplicateErrorMessage)
      return null
    }
  }

  editCategory(row: CategoryData) {
    this.resetUnsavedChanges(row)
    this.deleteRow()
    this.selectedCategory = this.selectedCategory?.categoryId === row.categoryId ? null : row
    this.isEditable = true;
    this.category = Object.assign({}, row)
    return this.selectedCategory;
  }

  private resetUnsavedChanges(row: CategoryData) {
    if (this.category !== undefined && this.category.categoryId !== row.categoryId) {
      this.updateDatasource(this.category);
    }
  }

  private updateDatasource(previousCategory: CategoryData) {
    let data = this.dataSource.data
    let index = data.findIndex(category => category.categoryId === previousCategory.categoryId)
    if (index !== -1) {
      data.splice(index, 1, previousCategory)
      this.dataSource.data = data
    }
  }

  updateCategory(row: CategoryData) {
    let categoryRequest: CategoryRequest | null = this.categoryRequest(row);
    if (this.category?.categoryName.toLowerCase().replace(/\s/g, '') !== row.categoryName.toLowerCase().replace(/\s/g, '')) {
      categoryRequest = this.getCategoryRequest(row);
    }
    if (categoryRequest !== null) {
      categoryRequest.categoryId = row.categoryId
      this.appService.updateCategory(row).pipe(takeUntil(this.destroy$)).subscribe({
        next: (_data) => {
          row.isEdit = false;
          this.selectedCategory = null;
          this.table.renderRows()
          this.showNotification(this.updateSuccessMessage, NOTIFICATION_DURATION)
          this.categoryData = []
          this.category = undefined;
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

  cancelChanges(row: CategoryData) {
    if(this.category) {
      row.categoryName = this.category.categoryName
      row.active = this.category.active
      row.updatedAt = this.category.updatedAt
      row.comments = this.category.comments
    }
    this.selectedCategory = this.selectedCategory === row ? null : row
    return row;
  }

  private sendDataToStore(value: CategoryResponse) {
    value.modules = []
    this.categories.push(value)
    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categories}))
  }

  updateToStore(_data: CategoryResponse) {
    let category = this.categories.find(eachCategory => eachCategory.categoryId === _data.categoryId)
    if (category !== undefined) {
      category.categoryName = _data.categoryName
      category.active = _data.active
      category.comments = _data.comments
      category.updatedAt = Number(new Date())
      this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categories}))
    }

  }

  private categoryRequest(row: CategoryData) : CategoryRequest {
    let categoryRequest : CategoryRequest = {
      categoryName : row.categoryName,
      active : row.active,
      comments : row.comments
    }
    return categoryRequest;
  }
}
