/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Input} from '@angular/core';
import {AssessmentStructure} from "../../types/assessmentStructure";
import {MatTableDataSource} from "@angular/material/table";
import {data_local} from "../../../assets/messages";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  @Input()
  dataSource!: MatTableDataSource<AssessmentStructure>

  searchBarText = data_local.SEARCH.SEARCH_BAR_TEXT;

  constructor() {
    this.dataSource = new MatTableDataSource<AssessmentStructure>()
  }


  searchAssessments() {
    const filterValue = document.getElementById("search") as HTMLInputElement;
    this.dataSource.filterPredicate = (d: AssessmentStructure, filter) => {
      const assessmentNameFilter = d["assessmentName"].trim().toLowerCase();
      const organizationNameFilter = d["organisationName"].trim().toLowerCase();
      const assessmentStatusFilter = d["assessmentStatus"].trim().toLowerCase();
      return assessmentNameFilter.indexOf(filter) !== -1 || organizationNameFilter.indexOf(filter) !== -1 || assessmentStatusFilter.indexOf(filter) !== -1;
    }
    this.dataSource.filter = filterValue.value.trim().toLowerCase();
  }
}

