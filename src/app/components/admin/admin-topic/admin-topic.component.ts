import {Component, OnInit, ViewChild} from '@angular/core';
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
export class AdminTopicComponent implements OnInit {
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


  constructor(private appService: AppServiceService, private _snackbar: MatSnackBar) {
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
      this.dataSourceArray = [...this.dataSource.data]
    })
  }

  private fetchModuleDetails(eachCategory: CategoryResponse) {
    let category = {categoryId: eachCategory.categoryId, module: [{moduleId: -1, moduleName: ""}]}
    this.categoryList.push({categoryId: eachCategory.categoryId, categoryName: eachCategory.categoryName,active:eachCategory.active})
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
    this.dataSource.data.splice(0, 0, newTopic)
    this.table.renderRows();
    // this.dataSource.paginator = this.paginator
    this.isTopicAdded = true
  }

  cancelChanges(row
                  :
                  any
  ) {
    console.log(row)

  }

  saveTopic(row: any) {
    let topicSaveRequest = this.getTopicRequest(row);
    this.appService.saveTopic(topicSaveRequest).subscribe({
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
    return {
      module: row.moduleName,
      topicName: row.topicName,
      active: row.active,
      comments: row.comments
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

  editTopic(row: any
  ) {

  }

  updateTopic(row
                :
                any
  ) {

  }

  deleteAddedTopicRow() {
    let data = this.dataSource.data
    data.splice(0, 1)
    this.dataSource.data = data
    this.table.renderRows()
  }

  shortlistModule(categoryId: any) {
    this.moduleList = this.categoryAndModule.find(module => module.categoryId == categoryId).module
  }
}
