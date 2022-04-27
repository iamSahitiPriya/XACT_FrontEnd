import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AssessmentStructure} from "../../types/assessmentStructure";
import {MatTableDataSource} from "@angular/material/table";
import {SearchStructure} from "../../types/searchStructure";
import {MatPaginator} from "@angular/material/paginator";
import {AppServiceService} from "../../services/app-service/app-service.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  @Input()
  dataSource!: MatTableDataSource<SearchStructure>


  constructor() {
    this.dataSource = new MatTableDataSource<SearchStructure>()


  }


  searchAssessments() {
    const filterValue = document.getElementById("search") as HTMLInputElement;
    this.dataSource.filter = filterValue.value.trim().toLowerCase()
    console.log(this.dataSource);

  }
}

