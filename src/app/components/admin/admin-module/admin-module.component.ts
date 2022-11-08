import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ModuleData} from "../../../types/moduleData";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {Subject, takeUntil} from "rxjs";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {data_local} from "../../../messages";
import {MatPaginator} from "@angular/material/paginator";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {CategoryResponse} from "../../../types/categoryResponse";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-admin-module',
  templateUrl: './admin-module.component.html',
  styleUrls: ['./admin-module.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '100px'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AdminModuleComponent implements OnInit, OnDestroy{
  moduleStructure : ModuleData[];
  displayedColumns: string[] = ['categoryName','moduleName','updatedAt','active','edit'];
  displayColumns: string[] = [...this.displayedColumns, 'expand'];
  dataSource : MatTableDataSource<ModuleData>
  commonErrorFieldText = data_local.ASSESSMENT.ERROR_MESSAGE_TEXT;
  isModuleAdded: boolean = false;
  categories =new Set<string>();
  module : ModuleData;
  isEditable: boolean;
  categoryDetails : CategoryResponse[];

  private destroy$: Subject<void> = new Subject<void>();

  @ViewChild(MatTable) table: MatTable<ModuleData>
  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceArray : ModuleData[];
  dataToDisplayed :ModuleData[];
  selectedModule: ModuleData | null;

  constructor(private appService: AppServiceService, private _snackbar:MatSnackBar) {
    this.moduleStructure = []
    this.dataSource = new MatTableDataSource<ModuleData>(this.moduleStructure)
    this.dataToDisplayed = [...this.dataSource.data]

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.appService.getAllCategories().pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.categoryDetails=data
      data.forEach((eachCategory) => {
          eachCategory.modules?.forEach(eachModule => {
              let module: ModuleData = {
                moduleId: -1,
                moduleName: "",
                categoryName: "",
                active: true,
                categoryStatus:true,
                updatedAt: -1,
                comments: ""
              }
              module.moduleId = eachModule.moduleId;
              module.moduleName = eachModule.moduleName;
              module.active = eachModule.active;
              module.categoryName = eachCategory.categoryName;
              module.updatedAt = eachModule.updatedAt;
              module.comments = eachModule.comments;
              module.categoryStatus=eachCategory.active;
              this.moduleStructure.push(module);
            }
          )
            this.categories.add(eachCategory.categoryName)
        }
      )
      this.dataSource = new MatTableDataSource<ModuleData>(this.moduleStructure)
      this.dataSourceArray = [...this.dataSource.data]
      this.paginator.pageIndex = 0
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }
  showError(message: string, action: string) {
    this._snackbar.open(message, action, {
      verticalPosition: 'top',
      panelClass: ['errorSnackbar'],
      duration: 2000
    })
  }

  addModuleRow() {
    let newModule = {
      moduleId: 0, categoryName: '',moduleName: '', categoryStatus:true,active: true, updatedAt: Date.now(), isEdit: true, comments: ''
    }
    this.dataSource.data.splice(this.paginator.pageIndex * this.paginator.pageSize, 0, newModule)
    this.table.renderRows();
    this.dataSource.paginator = this.paginator
    this.isModuleAdded = true
  }

  updateModule(row :any) {
    let moduleRequest={
      "moduleId":row.moduleId,
      "moduleName":row.moduleName,
      "category": row.categoryName,
      "active": row.active,
      "comments": row.comments
    }
    this.appService.updateModule(moduleRequest).pipe(takeUntil(this.destroy$)).subscribe( {
      next: (_data) => {
        row.isEdit = false;
        this.selectedModule= null;
        this.table.renderRows()
        this.moduleStructure = []
        this.ngOnInit()
      }, error: _error => {
        this.showError("Some error occurred", "Close");
      }
    })
  }

  cancelChanges(row : any) {
    row.categoryName = this.module.categoryName
    row.moduleName=this.module.moduleName
    row.active = this.module.active
    row.updatedAt = this.module.updatedAt
    row.comments = this.module.comments
    this.selectedModule = this.selectedModule === row ? null : row
    return row;
  }

  editRow(row :any) {

    this.selectedModule = this.selectedModule === row ? null : row
    this.isEditable = true;
    this.module = Object.assign({}, row)
    return this.selectedModule;

  }

  deleteRow() {
    let data = this.dataSource.data
    data.splice(this.paginator.pageIndex * this.paginator.pageSize, 1)
    this.dataSource.data = data
    this.table.renderRows()
  }

  saveModule(row :any) {
    let moduleRequest={
      "moduleName":row.moduleName,
      "category": row.categoryName,
      "active": row.active,
      "comments": row.comments
    }
    this.appService.saveModule(moduleRequest).subscribe({
        next: (_data) => {
          let data = this.dataSource.data
          row.isEdit = false
          this.isEditable = false;
          data.splice(this.paginator.pageIndex * this.paginator.pageSize, 1)
          this.dataSource.data = data
          this.table.renderRows()
          this.moduleStructure = []
          this.ngOnInit()
        }, error: _error => {
          this.showError("Some error occurred", "Close");
        }
      }
    )
  }

}
