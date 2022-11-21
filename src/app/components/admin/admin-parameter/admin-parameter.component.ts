import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {data_local} from "../../../messages";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subject, takeUntil} from "rxjs";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {NotificationSnackbarComponent} from "../../notification-component/notification-component.component";
import {CategoryResponse} from "../../../types/categoryResponse";
import {ModuleStructure} from "../../../types/moduleStructure";
import {ParameterData} from "../../../types/ParameterData";
import {TopicStructure} from "../../../types/topicStructure";

@Component({
  selector: 'app-admin-parameter',
  templateUrl: './admin-parameter.component.html',
  styleUrls: ['./admin-parameter.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '100px'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AdminParameterComponent implements OnInit {
  parameterData : ParameterData[];
  displayedColumns: string[] = ['categoryName', 'moduleName', 'topicName','parameterName','updatedAt','active', 'edit', 'reference'];
  commonErrorFieldText = data_local.ASSESSMENT.ERROR_MESSAGE_TEXT;
  dataSource: MatTableDataSource<ParameterData>;
  displayColumns: string[] = [...this.displayedColumns, 'expand'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<ParameterData>
  dataToDisplayed: ParameterData[]
  private destroy$: Subject<void> = new Subject<void>();
  private dataSourceArray: ParameterData[];
  categoryList: any[] = []
  moduleList: any[] = []
  selectedParameter: ParameterData | null;
  categoryAndModule = new Map();
  moduleAndTopic = new Map();
  topicList : any[]=[];
  topicAndParameter=new Map();
  private isParameterAdded: boolean;
  private isEditable: boolean;


  constructor(private appService: AppServiceService, private _snackbar: MatSnackBar) {
    this.parameterData = []
    this.dataSource = new MatTableDataSource<ParameterData>(this.parameterData)
    this.dataToDisplayed = [...this.dataSource.data]
  }

  ngOnInit(): void {
    this.appService.getAllCategories().pipe(takeUntil(this.destroy$)).subscribe(data => {
      data.forEach(eachCategory => {
        this.fetchModuleDetails(eachCategory);
      })
      this.dataSource = new MatTableDataSource<ParameterData>(this.parameterData)
      this.dataSourceArray = [...this.dataSource.data]
      this.paginator.pageIndex = 0
      this.dataSource.paginator = this.paginator;
    })
  }

  private fetchModuleDetails(eachCategory: CategoryResponse) {
    let module: any [] = [];
    this.categoryList.push({
      categoryId: eachCategory.categoryId,
      categoryName: eachCategory.categoryName,
      active: eachCategory.active
    })
    eachCategory.modules?.forEach(eachModule => {
      this.moduleAndTopic.set(eachModule.moduleId, [])
      module.push({moduleId: eachModule.moduleId, moduleName: eachModule.moduleName, active: eachModule.active})
      this.categoryAndModule.set(eachCategory.categoryId, module)
      if (eachModule.topics) {
        this.fetchTopics(eachModule, eachCategory);
      }
    })
  }

  private fetchTopics(eachModule: ModuleStructure, eachCategory: CategoryResponse) {
    let topic:any[]=[];
    eachModule.topics?.forEach(eachTopic => {
      this.topicAndParameter.set(eachTopic.topicId,[])
      topic.push({topicId: eachTopic.topicId, topicName: eachTopic.topicName, active: eachTopic.active})
      this.moduleAndTopic.set(eachModule.moduleId, topic)
      if(eachTopic.parameters) {
        this.fetchParameters(eachTopic, eachCategory, eachModule);
      }
    })
  }

  private fetchParameters(eachTopic: TopicStructure, eachCategory: CategoryResponse, eachModule: ModuleStructure) {
    let parameters:any[]=[];
    eachTopic.parameters?.forEach(eachParameter => {
      parameters.push({parameterId : eachParameter.parameterId ,parameterName : eachParameter.parameterName,active : eachParameter.active});
      this.topicAndParameter.set(eachTopic.topicId,parameters);
      let parameter: ParameterData = {
        categoryId: -1,
        categoryName: "",
        moduleId: -1,
        moduleName: "",
        topicId: -1,
        topicName: "",
        active: false,
        updatedAt: 123,
        comments: "",
        parameterId: 0,
        parameterName: ''
      }
      parameter.categoryId = eachCategory.categoryId
      parameter.categoryName = eachCategory.categoryName
      parameter.moduleId = eachModule.moduleId
      parameter.moduleName = eachModule.moduleName
      parameter.topicId = eachTopic.topicId
      parameter.parameterId = eachParameter.parameterId
      parameter.parameterName = eachParameter.parameterName
      parameter.active = eachParameter.active
      parameter.topicName = eachTopic.topicName
      parameter.updatedAt = eachParameter.updatedAt
      parameter.comments = eachParameter.comments
      this.parameterData.push(parameter)
    })
  }

  addParameterRow() {
    // let newTopic = {
    //   categoryId: -1,
    //   categoryName: "",
    //   moduleId: -1,
    //   moduleName: "",
    //   topicId: -1,
    //   topicName: "",
    //   active: false,
    //   updatedAt: Date.now(),
    //   comments: "",
    //   isEdit: true
    // }
    // this.dataSource.data.splice(0, 0, newTopic)
    // this.table.renderRows();
    // // this.dataSource.paginator = this.paginator
    // this.isTopicAdded = true
  }

  cancelChanges(row
                  :
                  any
  ) {
    console.log(row)

  }

  saveParameter(row: any) {
    // let topicSaveRequest = this.getTopicRequest(row);
    // this.appService.saveTopic(topicSaveRequest).subscribe({
    //   next: (_data) => {
    //     let data = this.dataSource.data
    //     row.isEdit = false
    //     this.isEditable = false;
    //     data.splice(0, 1)
    //     this.dataSource.data = data
    //     this.table.renderRows()
    //     this.topicData = []
    //     this.ngOnInit()
    //   }, error: (_err) => {
    //     this.showError("Some error occurred")
    //   }
    // })
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

  editParameter(row: any) {
    this.selectedParameter = this.selectedParameter=== row ? null : row
    this.isEditable = true;
    this.parameterData = Object.assign({}, row)
    return this.selectedParameter;
  }

  updateParameter(row
                :
                any
  ) {

  }

  deleteAddedParameterRow() {
    let data = this.dataSource.data
    data.splice(0, 1)
    this.dataSource.data = data
    this.table.renderRows()
  }

  shortlistModule(categoryName: string) {
    let categoryId = this.categoryList.find(eachCategory => eachCategory.categoryName === categoryName).categoryId
    this.moduleList = this.categoryAndModule.get(categoryId)
    this.moduleList.sort((module1, module2) => Number(module2.active) - Number(module1.active))
  }

  shortListTopics(moduleName: string) {
    let moduleId =this.moduleList.find(eachModule => eachModule.moduleName === moduleName).moduleId
    this.topicList =this.moduleAndTopic.get(moduleId)
    this.topicList.sort((topic1,topic2)=>Number(topic2.active)-Number(topic1.active))
  }
}

