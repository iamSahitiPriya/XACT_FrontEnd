import {Component, Input} from '@angular/core';
import {AssessmentStructure} from "../assessments/assessmentStructure";
import {ASSESSMENT_DATA} from "../assessments/assessments.component";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent  {
  @Input()
  dataSource!:MatTableDataSource<AssessmentStructure>
  constructor() {
    this.dataSource = new MatTableDataSource<AssessmentStructure>(ASSESSMENT_DATA)
  }



  searchAssessments() {
    const filterValue = document.getElementById("search") as HTMLInputElement;
    this.dataSource.filter =  filterValue.value.trim().toLowerCase()
  }
}
