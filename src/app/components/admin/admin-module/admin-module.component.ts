/*
 *  Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ModuleData} from "../../../types/moduleData";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {Observable, Subject, takeUntil} from "rxjs";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {data_local} from "../../../messages";
import {MatPaginator} from "@angular/material/paginator";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {CategoryResponse} from "../../../types/categoryResponse";
import {MatSort} from "@angular/material/sort";
import {NotificationSnackbarComponent} from "../../notification-component/notification-component.component";
import {Store} from "@ngrx/store";
import {AppStates} from "../../../reducers/app.states";
import * as fromActions from "../../../actions/assessment-data.actions";
import {ModuleRequest} from "../../../types/Admin/moduleRequest";
import {ModuleStructure} from "../../../types/moduleStructure";
import {ModuleResponse} from "../../../types/Admin/moduleResponse";

const NOTIFICATION_DURATION = 2000;

@Component({
  selector: 'app-admin-module',
  templateUrl: './admin-module.component.html',
  styleUrls: ['./admin-module.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '100%'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AdminModuleComponent implements OnInit, OnDestroy {
  moduleStructure: ModuleData[];
  displayedColumns: string[] = ['categoryName', 'moduleName', 'updatedAt', 'active', 'edit', 'action'];
  displayColumns: string[] = [...this.displayedColumns, 'expand'];
  dataSource: MatTableDataSource<ModuleData>
  commonErrorFieldText = data_local.ASSESSMENT.ERROR_MESSAGE_TEXT;
  isModuleAdded: boolean = false;
  module: ModuleData | undefined;
  isEditable: boolean;
  categoryDetails: CategoryResponse[] = [];
  isModuleUnique = true;
  mandatoryFieldText = data_local.ASSESSMENT.MANDATORY_FIELD_TEXT;
  masterData : Observable<CategoryResponse[]>
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
  addModule = data_local.ADMIN.MODULE.ADD_MODULE

  private destroy$: Subject<void> = new Subject<void>();

  @ViewChild(MatTable) table: MatTable<ModuleData>
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  dataSourceArray: ModuleData[];
  dataToDisplayed: ModuleData[];
  selectedModule: ModuleData | null;

  constructor(private appService: AppServiceService, private _snackBar: MatSnackBar, private store: Store<AppStates>) {
    this.masterData = this.store.select((storeMap) => storeMap.masterData.masterData)
    this.moduleStructure = []
    this.dataSource = new MatTableDataSource<ModuleData>(this.moduleStructure)
    this.dataToDisplayed = [...this.dataSource.data]

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.categoryDetails = []
    this.masterData.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.categoryDetails = data
      data?.forEach((eachCategory) => {
        this.getModules(eachCategory);
      })
      this.sortModule();
    })
  }

  sortModule() {
    this.moduleStructure.sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt));
    this.categoryDetails?.sort((a, b) => Number(b.active) - Number(a.active))
    this.dataSource = new MatTableDataSource<ModuleData>(this.moduleStructure)
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

  private getModules(eachCategory: CategoryResponse) {
    eachCategory.modules?.forEach(eachModule => {
        let module: ModuleData = {
          moduleId: eachModule.moduleId,
          moduleName: eachModule.moduleName,
          categoryName: eachCategory.categoryName,
          categoryId: eachCategory.categoryId,
          active: eachModule.active,
          categoryStatus: eachCategory.active,
          updatedAt: eachModule.updatedAt,
          comments: eachModule.comments
        }
        this.moduleStructure.push(module);
      }
    )
  }

  showError(message: string) {
    this._snackBar.openFromComponent(NotificationSnackbarComponent, {
      data: {message: message, iconType: "error_outline", notificationType: "Error:"}, panelClass: ['error-snackBar'],
      duration: NOTIFICATION_DURATION,
      verticalPosition: "top",
      horizontalPosition: "center"
    })
  }

  addModuleRow() {
    let newModule: ModuleData = {
      moduleId: -1,
      categoryName: '',
      categoryId: 0,
      moduleName: '',
      categoryStatus: true,
      active: true,
      updatedAt: Date.now(),
      isEdit: true,
      comments: ''
    }
    this.deleteAddedModuleRow()
    this.selectedModule = this.selectedModule === newModule ? null : newModule
    this.dataSource.data.splice(this.paginator.pageIndex * this.paginator.pageSize, 0, newModule)
    this.table.renderRows();
    this.dataSource.paginator = this.paginator
    this.isModuleAdded = true
  }

  updateModule(row: ModuleData) {
    let moduleRequest = this.setModuleRequest(row);
    if (this.module?.moduleName.toLowerCase().replace(/\s/g, '') !== row.moduleName.toLowerCase().replace(/\s/g, '')) {
      moduleRequest = this.getModuleRequest(row);
    }
    if (this.isModuleUnique && moduleRequest !== null) {
      moduleRequest.moduleId = row.moduleId
      this.appService.updateModule(moduleRequest).pipe(takeUntil(this.destroy$)).subscribe({
        next: (_data) => {
          row.isEdit = false;
          this.selectedModule = null;
          this.table.renderRows()
          this.updateModuleDataToStore(_data)
          this.showNotification(this.updateSuccessMessage, NOTIFICATION_DURATION)
          this.moduleStructure = []
          this.module = undefined
          this.ngOnInit()
        }, error: _error => {
          this.showError(this.serverErrorMessage);
        }
      })
    }
  }

  cancelChanges(row: ModuleData) {
    if (this.module) {
      row.categoryName = this.module.categoryName
      row.moduleName = this.module.moduleName
      row.active = this.module.active
      row.updatedAt = this.module.updatedAt
      row.comments = this.module.comments
    }
    this.selectedModule = this.selectedModule === row ? null : row
    return row;
  }

  editRow(row: ModuleData) {
    this.resetUnsavedChanges(row)
    this.deleteAddedModuleRow()
    this.selectedModule = this.selectedModule === row ? null : row
    this.isEditable = true;
    this.module = Object.assign({}, row)
    return this.selectedModule;
  }

  private resetUnsavedChanges(row: ModuleData) {
    if (this.module !== undefined && this.module.moduleId !== row.moduleId)
      this.updateDataSource(this.module)
  }

  private updateDataSource(previousModule: ModuleData) {
    let data = this.dataSource.data
    let index = data.findIndex(module => module.moduleId === previousModule.moduleId)
    if (index !== -1) {
      data.splice(index, 1, previousModule)
      this.dataSource.data = data
    }

  }

  private deleteAddedModuleRow() {
    let data = this.dataSource.data
    let index = data.findIndex(module => module.moduleId === -1)
    if (index !== -1) {
      data.splice(index, 1);
      this.dataSource.data = data
      this.selectedModule = null
      this.table.renderRows()
    }
  }

  private showNotification(reportData: string, duration: number) {
    this._snackBar.openFromComponent(NotificationSnackbarComponent, {
      data: {message: reportData, iconType: "done", notificationType: "Success:"}, panelClass: ['success'],
      duration: duration,
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }

  deleteRow() {
    let data = this.dataSource.data
    this.selectedModule = null;
    data.splice(this.paginator.pageIndex * this.paginator.pageSize, 1)
    this.dataSource.data = data
    this.table.renderRows()
  }

  saveModule(row: ModuleData) {
    let moduleRequest = this.getModuleRequest(row);
    if (this.isModuleUnique && moduleRequest !== null) {
      this.appService.saveModule(moduleRequest).pipe(takeUntil(this.destroy$)).subscribe({
          next: (_data) => {
            let data = this.dataSource.data
            row.isEdit = false
            this.isEditable = false;
            this.selectedModule = null
            data.splice(this.paginator.pageIndex * this.paginator.pageSize, 1)
            this.dataSource.data = data
            this.table.renderRows()
            this.sendDataToStore(_data);
            this.moduleStructure = []
            this.ngOnInit()
          }, error: _error => {
            this.showError(this.serverErrorMessage);
          }
        }
      )
    }
  }

  private getModuleRequest(row: ModuleData) {
    let selectedCategoryId = this.categoryDetails.find(category => category.categoryName === row.categoryName)?.categoryId;
    let moduleArray: ModuleStructure[] | undefined = this.categoryDetails.find(category => category.categoryName === row.categoryName)?.modules
    let index = moduleArray?.findIndex((module: ModuleStructure) => module.moduleName.toLowerCase().replace(/\s/g, '') === row.moduleName.toLowerCase().replace(/\s/g, ''));
    let moduleRequest: ModuleRequest;
    if ((index === -1 || index === undefined) && selectedCategoryId !== undefined) {
      this.isModuleUnique = true;
      moduleRequest = {
        moduleName: row.moduleName,
        category: selectedCategoryId,
        active: row.active,
        comments: row.comments
      }
    } else {
      this.isModuleUnique = false;
      this.showError(this.duplicateErrorMessage)
      return null
    }

    return moduleRequest;
  }

  private updateModuleDataToStore(_data: ModuleResponse) {
    let modules : ModuleStructure[] | undefined = this.categoryDetails.find(eachCategory => eachCategory.categoryId === this.module?.categoryId)?.modules
    let index : number | undefined = modules?.findIndex((eachModule) => eachModule.moduleId === this.module?.moduleId)
    if (index !== -1 && index !== undefined) {
      let fetchedModule: ModuleStructure | undefined = modules?.slice(index, index + 1)[0]
      _data.topics = fetchedModule?.topics;
      modules?.splice(index, 1)
      this.sendDataToStore(_data)
    }
  }

  sendDataToStore(_data: ModuleResponse) {
    let modules = this.categoryDetails.find(eachCategory => eachCategory.categoryId === _data.categoryId)?.modules
    let module :ModuleStructure = {
      moduleId: _data.moduleId,
      moduleName: _data.moduleName,
      category: _data.categoryId,
      active: _data.active,
      updatedAt: Date.now(),
      comments: _data.comments,
      topics: _data.topics ? _data.topics : []
    }
    modules?.push(module)
    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categoryDetails}))
  }

  private setModuleRequest(row: ModuleData): ModuleRequest | null {
    this.isModuleUnique = true;
    let selectedCategoryId = this.categoryDetails.find(category => category.categoryName === row.categoryName)?.categoryId;
    if (selectedCategoryId) {
      let moduleRequest: ModuleRequest = {
        moduleId: row.moduleId,
        moduleName: row.moduleName,
        category: selectedCategoryId,
        active: row.active,
        comments: row.comments
      }
      return moduleRequest
    }
    return null;
  }

}
