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
import {Subject, takeUntil} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {data_local} from "../../../messages";
import {NotificationSnackbarComponent} from "../../notification-component/notification-component.component";


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
  categoryData: CategoryData[]
  displayedColumns: string[] = ['categoryName', 'updatedAt', 'active', 'edit'];
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


  constructor(private appService: AppServiceService, private _snackbar: MatSnackBar) {
    this.categoryData = []
    this.dataSource = new MatTableDataSource<CategoryData>(this.categoryData)
    this.dataToDisplayed = [...this.dataSource.data]

  }

  ngOnInit(): void {
    this.appService.getAllCategories().pipe(takeUntil(this.destroy$)).subscribe(data => {
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
      this.dataSource = new MatTableDataSource<CategoryData>(this.categoryData)
      this.dataSourceArray = [...this.dataSource.data]
      this.paginator.pageIndex = 0
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  addCategoryRow() {
    let newCategory = {
      categoryId: 0, categoryName: '', active: true, updatedAt: Date.now(), isEdit: true, comments: ''
    }
    this.dataSource.data.splice(this.paginator.pageIndex * this.paginator.pageSize, 0, newCategory)
    this.table.renderRows();
    this.dataSource.paginator = this.paginator
    this.isCategoryAdded = true

  }

  deleteRow() {
    let data = this.dataSource.data
    data.splice(this.paginator.pageIndex * this.paginator.pageSize, 1)
    this.dataSource.data = data
    this.table.renderRows()
  }

  showError(message: string) {
    this._snackbar.openFromComponent(NotificationSnackbarComponent, {
      data : { message  : message, iconType : "error_outline", notificationType: "Error:"}, panelClass: ['error-snackBar'],
      duration : 2000,
      verticalPosition : "top",
      horizontalPosition : "center"
    })
  }

  saveCategory(value: any) {
    let categoryRequest = {
      "categoryName": value.categoryName,
      "active": value.active,
      "comments": value.comments
    }

    let flag = false;
    this.dataSource.data.slice((this.paginator.pageIndex * this.paginator.pageSize) + 1).forEach(eachCategory => {
        if (eachCategory.categoryName.trim().toLowerCase() === value.categoryName.trim().toLowerCase()) {
          flag = true;
          this.showError("No duplicate categories are allowed");
        }
      }
    )
    if (!flag) {
      this.appService.saveCategory(categoryRequest).subscribe({
        next: (_data) => {
          let data = this.dataSource.data
          value.isEdit = false
          this.isEditable = false;
          data.splice(this.paginator.pageIndex * this.paginator.pageSize, 1)
          this.dataSource.data = data
          this.table.renderRows()
          this.categoryData = []
          this.ngOnInit()
        }, error: _error => {
          this.showError("Some error occurred");
        }
      })
    }
  }

  editCategory(row: any) {

    this.selectedCategory = this.selectedCategory === row ? null : row
    this.isEditable = true;
    this.category = Object.assign({}, row)
    return this.selectedCategory;
  }

  updateCategory(row: any) {
    this.appService.updateCategory(row).pipe(takeUntil(this.destroy$)).subscribe({
      next: (_data) => {
        row.isEdit = false;
        this.selectedCategory = null;
        this.table.renderRows()
        this.showNotification("Your changes have been successfully updated.", 200000)
        this.categoryData = []
        this.ngOnInit()
      }, error: _error => {
        this.showError("Some error occurred");
      }
    })

  }

  private showNotification(reportData: string, duration: number) {
    this._snackbar.openFromComponent(NotificationSnackbarComponent, {
      data: { message :reportData, iconType: "done", notificationType: "Success:"}, panelClass: ['success'],
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
}
