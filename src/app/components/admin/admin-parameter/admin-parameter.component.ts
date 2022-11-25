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
import cloneDeep from "lodash/cloneDeep";

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
  parameterData: ParameterData[];
  displayedColumns: string[] = ['categoryName', 'moduleName', 'topicName', 'parameterName', 'updatedAt', 'active', 'edit', 'reference'];
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
  parameter : ParameterData
  unSavedParameter : ParameterData
  selectedParameter: ParameterData | null;
  categoryAndModule = new Map();
  moduleAndTopic = new Map();
  topicList: any[] = [];
  topicAndParameter = new Map();
  isParameterAdded: boolean = false;
  isEditable: boolean;
  isParameterUnique =true;
  moduleNotFoundMessage: string = "Module not found"
  topicNotFoundMessage: string = "Topic not found"
  private duplicateTopicError: string = "Duplicates are not allowed"


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
      this.parameterData.sort((parameter1,parameter2)=>Number(parameter2.updatedAt) - Number(parameter1.updatedAt));
      this.categoryList?.sort((category1, category2) => Number(category2.active) - Number(category1.active))
      this.moduleList?.sort((module1, module2) => Number(module2.active) - Number(module1.active))
      this.topicList?.sort((topic1, topic2) => Number(topic2.active) - Number(topic1.active))
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
    let topic: any[] = [];
    this.moduleList.push({
    moduleId: eachModule.moduleId, moduleName: eachModule.moduleName, active: eachModule.active
    })
    eachModule.topics?.forEach(eachTopic => {
      this.topicAndParameter.set(eachTopic.topicId, [])
      topic.push({topicId: eachTopic.topicId, topicName: eachTopic.topicName, active: eachTopic.active})
      this.moduleAndTopic.set(eachModule.moduleId, topic)
      if (eachTopic.parameters) {
        this.fetchParameters(eachTopic, eachCategory, eachModule);
      }
    })
  }

  private fetchParameters(eachTopic: TopicStructure, eachCategory: CategoryResponse, eachModule: ModuleStructure) {
    let parameters: any[] = [];
    this.topicList.push({
      topicId: eachTopic.topicId, topicName: eachTopic.topicName, active: eachTopic.active
    })
    eachTopic.parameters?.forEach(eachParameter => {
      parameters.push({
        parameterId: eachParameter.parameterId,
        parameterName: eachParameter.parameterName,
        active: eachParameter.active
      });
      this.topicAndParameter.set(eachTopic.topicId, parameters);
      let parameter: ParameterData = {
        categoryId: -1,
        categoryName: "",
        categoryStatus:false,
        moduleId: -1,
        moduleName: "",
        moduleStatus:false,
        topicId: -1,
        topicName: "",
        topicStatus:false,
        active: false,
        updatedAt: 123,
        comments: "",
        parameterId: 0,
        parameterName: ''
      }
      parameter.categoryId = eachCategory.categoryId
      parameter.categoryName = eachCategory.categoryName
      parameter.categoryStatus=eachCategory.active
      parameter.moduleId = eachModule.moduleId
      parameter.moduleName = eachModule.moduleName
      parameter.moduleStatus=eachModule.active
      parameter.topicId = eachTopic.topicId
      parameter.topicStatus=eachTopic.active
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
    let newParameter = {
      categoryId: -1,
      categoryName: "",
      categoryStatus:false,
      moduleId: -1,
      moduleName: "",
      moduleStatus:false,
      topicId: -1,
      topicName: "",
      topicStatus : false,
      parameterId: -1,
      parameterName: "",
      active: false,
      updatedAt: Date.now(),
      comments: "",
      isEdit: true
    }
    this.deleteAddedParameterRow()
    this.selectedParameter = this.selectedParameter === newParameter?null:newParameter
    this.dataSource.data.splice(0, 0, newParameter)
    this.table.renderRows();
    this.dataSource.paginator = this.paginator
    this.isParameterAdded = true
  }

  cancelChanges(row: any){
    row.categoryName = this.parameter.categoryName
    row.moduleName=this.parameter.moduleName
    row.parameterName=this.parameter.parameterName
    row.active = this.parameter.active
    row.updatedAt = this.parameter.updatedAt
    row.comments = this.parameter.comments
    this.selectedParameter = this.selectedParameter === row ? null : row
    return row;
  }


  saveParameter(row: any) {
    let parameterSaveRequest = this.getParameterRequest(row);
    if (this.isParameterUnique) {
      this.appService.saveParameter(parameterSaveRequest).subscribe({
        next: (_data) => {
          let data = this.dataSource.data
          row.isEdit = false
          this.isEditable = false;
          this.selectedParameter = null
          data.splice(0, 1)
          this.dataSource.data = data
          this.table.renderRows()
          this.parameterData = []
          this.ngOnInit()
        }, error: (_err) => {
          this.showError("Some error occurred")
        }
      })
    }
  }

  private getParameterRequest(row: any): any {
    let selectedTopicId = this.topicList.find(topic => topic.topicName === row.topicName).topicId
    let parameterArray = this.topicAndParameter.get(selectedTopicId)
    let index = parameterArray.findIndex((parameter: any) => parameter.parameterName.toLowerCase().replace(/\s/g, '') === row.parameterName.toLowerCase().replace(/\s/g, ''));
    if (index === -1) {
      return this.setParameterRequest(selectedTopicId, row);
    } else {
      this.isParameterUnique=false;
      this.showError(this.duplicateTopicError)
      return null
    }
  }

  private setParameterRequest(selectedTopicId : number, row: any) {
    this.isParameterUnique=true;
    return {
      topic: selectedTopicId,
      parameterName: row.parameterName,
      active: row.active,
      comments: row.comments,
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

  editParameter(row: any) {
    this.deleteAddedParameterRow()
    this.selectedParameter = this.selectedParameter === row ? null : row
    this.isEditable = true;
    this.unSavedParameter=cloneDeep(row)
    this.parameter = Object.assign({}, row)
    return this.selectedParameter;
  }

  updateParameter(row :any) {
    let selectedTopicId = this.topicList.find(topic => topic.topicName === row.topicName).topicId
    let parameterRequest = this.setParameterRequest(selectedTopicId,row);
    if(this.unSavedParameter.parameterName !== row.parameterName){
      parameterRequest =this.getParameterRequest(row);
    }
    if(this.isParameterUnique) {
      this.appService.updateParameter(parameterRequest, row.parameterId).pipe(takeUntil(this.destroy$)).subscribe({
        next: (_data) => {
          row.isEdit = false;
          this.selectedParameter = null;
          this.table.renderRows()
          this.showNotification("Your changes have been successfully updated.", 200000)
          this.parameterData = []
          this.ngOnInit()
        }, error: _error => {
          this.showError("Some error occurred");
        }
      })
    }
  }

  private showNotification(reportData: string, duration: number) {
    this._snackbar.openFromComponent(NotificationSnackbarComponent, {
      data: { message :reportData, iconType: "done", notificationType: "Success:"}, panelClass: ['success'],
      duration: duration,
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }


  deleteAddedParameterRow() {
    let data = this.dataSource.data
    let index = data.findIndex(parameter => parameter.parameterId === -1)
    if(index !== -1){
      data.splice(index,1);
      this.dataSource.data = data
      this.selectedParameter=null
      this.table.renderRows()
    }
  }

  shortlistModule(categoryName: string) {
    let categoryId = this.categoryList.find(eachCategory => eachCategory.categoryName === categoryName).categoryId
    this.moduleList = this.categoryAndModule.get(categoryId)
    if (this.moduleList === undefined) {
      this.moduleList = [{moduleName: this.moduleNotFoundMessage}]
    }
    this.moduleList.sort((module1, module2) => Number(module2.active) - Number(module1.active))
  }

  shortListTopics(moduleName: string) {
    let moduleId = this.moduleList.find(eachModule => eachModule.moduleName === moduleName).moduleId
    this.topicList = this.moduleAndTopic.get(moduleId)
    if (this.topicList.length === 0) {
      this.topicList = [{topicName: this.topicNotFoundMessage}]
    }
    this.topicList.sort((topic1, topic2) => Number(topic2.active) - Number(topic1.active))
  }


}

