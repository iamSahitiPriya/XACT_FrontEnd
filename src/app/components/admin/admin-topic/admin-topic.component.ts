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
export class AdminTopicComponent implements OnInit,OnDestroy {
  topicData: TopicData[];
  displayedColumns: string[] = ['categoryName', 'moduleName', 'topicName', 'active', 'updatedAt', 'edit', 'reference'];
  commonErrorFieldText = data_local.ASSESSMENT.ERROR_MESSAGE_TEXT;
  dataSource: MatTableDataSource<TopicData>;
  displayColumns: string[] = [...this.displayedColumns, 'expand'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<TopicData>
  dataToDisplayed: TopicData[]
  private destroy$: Subject<void> = new Subject<void>();
  private dataSourceArray: TopicData[];
  categoryList: any[] = []
  categoryAndModule: any[] = []
  moduleList: any[] = []
  selectedTopic: TopicData | null;
  private isTopicAdded: boolean;
  private isEditable: boolean;
  private unsavedTopic: TopicData;
  setCategory: string = '';
  setModule: string = '';


  constructor(private appService: AppServiceService, private _snackbar: MatSnackBar,) {
    this.topicData = []
    this.dataSource = new MatTableDataSource<TopicData>(this.topicData)
    this.dataToDisplayed = [...this.dataSource.data]
  }

  ngOnInit(): void {
    this.appService.getAllCategories().pipe(takeUntil(this.destroy$)).subscribe(data => {
      data.forEach(eachCategory => {
        this.fetchModuleDetails(eachCategory);
      })
      this.dataSource = new MatTableDataSource<TopicData>(this.topicData)
      this.paginator.pageIndex = 0
      this.dataSource.paginator = this.paginator;
      this.dataSourceArray = [...this.dataSource.data]
    })
  }

  private fetchModuleDetails(eachCategory: CategoryResponse) {
    let category = {categoryId: eachCategory.categoryId, module: [{moduleId: -1, moduleName: ""}]}
    this.categoryList.push({
      categoryId: eachCategory.categoryId,
      categoryName: eachCategory.categoryName,
      active: eachCategory.active
    })
    category.module.splice(0, 1)
    eachCategory.modules?.forEach(eachModule => {
      category.module.push({moduleId: eachModule.moduleId, moduleName: eachModule.moduleName})
      this.categoryAndModule.push(category)
      if (eachModule.topics) {
        this.fetchTopics(eachModule, eachCategory);
      }
    })
  }

  private fetchTopics(eachModule: ModuleStructure, eachCategory: CategoryResponse) {
    eachModule.topics?.forEach(eachTopic => {
      let topic: TopicData = {
        categoryId: -1,
        categoryName: "",
        moduleId: -1,
        moduleName: "",
        topicId: -1,
        topicName: "",
        active: false,
        updatedAt: 123,
        comments: ""
      }
      topic.categoryId = eachCategory.categoryId
      topic.categoryName = eachCategory.categoryName
      topic.moduleId = eachModule.moduleId
      topic.moduleName = eachModule.moduleName
      topic.topicId = eachTopic.topicId
      topic.active = eachTopic.active
      topic.topicName = eachTopic.topicName
      topic.updatedAt = eachTopic.updatedAt
      topic.comments = eachTopic.comments
      this.topicData.push(topic)
    })
  }

  addTopicRow() {
    let newTopic = {
      categoryId: -1,
      categoryName: "",
      moduleId: -1,
      moduleName: "",
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
    let selectedModuleId = this.moduleList.find(module => module.moduleName === row.moduleName).moduleId
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

  editTopic(row: any) {
    this.selectedTopic = this.selectedTopic == row ? null : row
    this.isEditable = true
    this.unsavedTopic = Object.assign({}, row)
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

  shortlistModule(categoryId: number) {
    this.moduleList = this.categoryAndModule.find(module => module.categoryId == categoryId).module
  }

  cancelUpdate(row: TopicData) {
    this.resetTopic(row);
    this.selectedTopic = this.selectedTopic === row ? null : row
    return row;
  }

  private resetTopic(row: TopicData) {
    row.categoryName = this.unsavedTopic.categoryName
    row.categoryId = this.unsavedTopic.categoryId
    row.active = this.unsavedTopic.active
    row.moduleName = this.unsavedTopic.moduleName
    row.moduleId = this.unsavedTopic.moduleId
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
