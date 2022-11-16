import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {data_local} from "../../../messages";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {TopicData} from "../../../types/topicData";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subject, takeUntil} from "rxjs";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {NotificationSnackbarComponent} from "../../notification-component/notification-component.component";
import {CategoryResponse} from "../../../types/categoryResponse";
import {ModuleStructure} from "../../../types/moduleStructure";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ModuleResponse} from "../../../types/Admin/moduleResponse";
import {TopicResponse} from "../../../types/Admin/topicResponse";
import cloneDeep from "lodash/cloneDeep";
import {createLogErrorHandler} from "@angular/compiler-cli/ngcc/src/execution/tasks/completion";

@Component({
  selector: 'app-admin-topic',
  templateUrl: './admin-topic.component.html',
  styleUrls: ['./admin-topic.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '100px'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AdminTopicComponent implements OnInit, OnDestroy {
  topicData: TopicResponse[];
  displayedColumns: string[] = ['categoryName', 'moduleName', 'topicName', 'active', 'updatedAt', 'edit', 'reference'];
  commonErrorFieldText = data_local.ASSESSMENT.ERROR_MESSAGE_TEXT;
  dataSource: MatTableDataSource<TopicResponse>;
  displayColumns: string[] = [...this.displayedColumns, 'expand'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<TopicData>
  dataToDisplayed: TopicResponse[]
  private destroy$: Subject<void> = new Subject<void>();
  private dataSourceArray: TopicResponse[];
  categoryList: any[] = []
  categoryAndModule = new Map()
  moduleList: any[] = []
  selectedTopic: TopicResponse | null;
  private isTopicAdded: boolean;
  private isEditable: boolean;
  private unsavedTopic: TopicResponse;
  setCategory: string = '';
  setModule: string = '';


  constructor(private appService: AppServiceService, private _snackbar: MatSnackBar,) {
    this.topicData = []
    this.dataSource = new MatTableDataSource<TopicResponse>(this.topicData)
    this.dataToDisplayed = [...this.dataSource.data]
  }

  ngOnInit(): void {
    this.appService.getAllTopics().pipe(takeUntil(this.destroy$)).subscribe(data => {
      data.forEach((eachTopic) => {
        if (eachTopic) {
          this.fetchCategory(eachTopic);
          this.fetchModule(eachTopic);
          this.fetchTopics(eachTopic);
        }
      })
      this.dataSource = new MatTableDataSource<TopicResponse>(this.topicData)
      this.paginator.pageIndex = 0
      this.dataSource.paginator = this.paginator;
      this.dataSourceArray = [...this.dataSource.data]
    })
  }

  private fetchModule(eachTopic: TopicResponse) {
    if (this.categoryAndModule.has(eachTopic.module.category.categoryId)) {
      let module = {
        moduleId: eachTopic.module.moduleId,
        moduleName: eachTopic.module.moduleName,
        active: eachTopic.module.active
      }
      let moduleList = this.categoryAndModule.get(eachTopic.module.category.categoryId)
      let index = moduleList.findIndex((module: { moduleId: number; }) => module.moduleId === eachTopic.module.moduleId)
      if (index == -1)
        moduleList.push(module)
      this.categoryAndModule.set(eachTopic.module.category.categoryId, moduleList)

    } else {
      let allModules = []
      let module = {
        moduleId: eachTopic.module.moduleId,
        moduleName: eachTopic.module.moduleName,
        active: eachTopic.module.active
      }
      allModules.push(module)
      this.categoryAndModule.set(eachTopic.module.category.categoryId, allModules)
    }
  }

  private fetchCategory(eachTopic: TopicResponse) {
    let index = this.categoryList.findIndex(category => category.categoryId == eachTopic.module.category.categoryId)
    if (index == -1) {
      this.categoryList.push({
        categoryId: eachTopic.module.category.categoryId,
        categoryName: eachTopic.module.category.categoryName,
        active: eachTopic.module.category.active
      })
    }
  }

  private fetchTopics(eachTopic: TopicResponse) {
    let topic: TopicResponse = {
      module: {
        category: {categoryId: -1, categoryName: "", active: false, comments: "", updatedAt: 0},
        moduleId: -1,
        moduleName: "",
        active: false,
        comments: "",
        updatedAt: 0
      },
      topicId: -1,
      topicName: "",
      active: false,
      updatedAt: 123,
      comments: ""
    }

    topic.module.category.categoryId = eachTopic.module.category.categoryId
    topic.module.category.categoryName = eachTopic.module.category.categoryName
    topic.module.moduleId = eachTopic.module.moduleId
    topic.module.moduleName = eachTopic.module.moduleName
    topic.topicId = eachTopic.topicId
    topic.active = eachTopic.active
    topic.topicName = eachTopic.topicName
    topic.updatedAt = eachTopic.updatedAt
    topic.comments = eachTopic.comments
    this.topicData.push(topic)
  }

  addTopicRow() {
    let newTopic = {
      module: {
        category: {categoryId: -1, categoryName: "", active: false, comments: "", updatedAt: 0},
        moduleId: -1,
        moduleName: "",
        active: false,
        comments: "",
        updatedAt: 0
      },
      topicId: -1,
      topicName: "",
      active: false,
      updatedAt: Date.now(),
      comments: "",
      isEdit: true
    }
    this.dataSource.data.splice(this.paginator.pageIndex * this.paginator.pageSize, 0, newTopic)
    this.table.renderRows();
    this.dataSource.paginator = this.paginator
    this.isTopicAdded = true
  }


  saveTopic(row: any) {
    let topicSaveRequest = this.getTopicRequest(row);
    this.appService.saveTopic(topicSaveRequest).pipe(takeUntil(this.destroy$)).subscribe({
      next: (_data) => {
        let data = this.dataSource.data
        row.isEdit = false
        this.isEditable = false;
        data.splice(0, 1)
        this.dataSource.data = data
        this.table.renderRows()
        this.topicData = []
        this.ngOnInit()
      }, error: (_err) => {
        this.showError("Some error occurred")
      }
    })
  }

  private getTopicRequest(row: any) {
    let selectedModuleId = this.moduleList.find(module => module.moduleName === row.module.moduleName).moduleId
    return {
      module: selectedModuleId,
      topicName: row.topicName,
      active: row.active,
      comments: row.comments,
    };
  }

  showError(message: string) {
    this._snackbar.openFromComponent(NotificationSnackbarComponent, {
      data: {message: message, iconType: "error_outline", notificationType: "Error:"}, panelClass: ['error-snackBar'],
      duration: 2000,
      verticalPosition: "top",
      horizontalPosition: "center"
    })
  }

  editTopic(row: TopicResponse) {
    this.selectedTopic = this.selectedTopic == row ? null : row
    this.isEditable = true
    this.unsavedTopic = cloneDeep(row)
    return this.selectedTopic
  }

  updateTopic(row: any) {
    let topicRequest = this.getTopicRequest(row)
    this.appService.updateTopic(topicRequest, row.topicId).pipe(takeUntil(this.destroy$)).subscribe({
        next: (_data) => {
          row.isEdit = false
          this.selectedTopic = null
          this.table.renderRows()
          this.showNotification("Your changes have been successfully updated.", 2000)
          this.topicData = []
          this.ngOnInit()
        }, error: _error => {
          this.showError("Some error occurred");
        }
      }
    )
  }

  deleteAddedTopicRow() {
    let data = this.dataSource.data
    data.splice(this.paginator.pageIndex * this.paginator.pageSize, 1)
    this.dataSource.data = data
    this.table.renderRows()
  }

  private showNotification(reportData: string, duration: number) {
    this._snackbar.openFromComponent(NotificationSnackbarComponent, {
      data: {message: reportData, iconType: "done", notificationType: "Success:"}, panelClass: ['success'],
      duration: duration,
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }

  shortlistModule(event:any) {
    console.log(event)
    let categoryId = this.categoryList.find(category => category.categoryName === event).categoryId
      this.moduleList = this.categoryAndModule.get(categoryId)
  }

  cancelUpdate(row: TopicResponse) {
    this.resetTopic(row);
    this.selectedTopic = this.selectedTopic === row ? null : row
    return row;
  }

  private resetTopic(row: TopicResponse) {
    console.log(this.unsavedTopic)
    row.module.category.categoryName = this.unsavedTopic.module.category.categoryName
    row.module.category.categoryId = this.unsavedTopic.module.category.categoryId
    row.active = this.unsavedTopic.active
    row.module.moduleName = this.unsavedTopic.module.moduleName
    row.module.moduleId = this.unsavedTopic.module.moduleId
    row.topicId = this.unsavedTopic.topicId
    row.topicName = this.unsavedTopic.topicName
    row.updatedAt = this.unsavedTopic.updatedAt
    row.comments = this.unsavedTopic.comments
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
