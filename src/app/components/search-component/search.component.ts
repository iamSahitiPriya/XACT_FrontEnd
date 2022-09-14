/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Input} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {data_local} from "../../messages";


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  @Input() columns:string[];
  @Input()
  dataSource!: MatTableDataSource<any>

  columnName : string [] = []

  searchBarText = data_local.SEARCH.SEARCH_BAR_TEXT;

  constructor() {
    this.dataSource = new MatTableDataSource<any>()
  }


  searchAssessments() {
    const filterValue = document.getElementById("search") as HTMLInputElement;
    this.dataSource.filteredData.map((element) => {
      this.columnName = Object.keys(element)
    })
    let firstColumnFilter = ""
    let flag = false
    this.dataSource.filterPredicate = (d: any, filter) => {
      flag = false
      for(let index = 1; index<=Number(this.columns[0]); index++){
        firstColumnFilter = d[this.columns[index]].trim().toLowerCase();
        flag = (firstColumnFilter.indexOf(filter) !== -1) || flag
      }
      return flag
    }
    this.dataSource.filter = filterValue.value.trim().toLowerCase();
  }
}

