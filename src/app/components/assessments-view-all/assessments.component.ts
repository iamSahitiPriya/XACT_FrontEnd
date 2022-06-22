/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from '@angular/material/paginator';
import {AssessmentStructure} from "../../types/assessmentStructure";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

/**
 * @title Table with expandable rows
 */
let assessments: AssessmentStructure[] = []
let valueEmitter = new BehaviorSubject<AssessmentStructure[]>(assessments)

@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.css']
})

export class AssessmentsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  private dialogRef: MatDialogRef<any>;
  blankAssessment: AssessmentStructure = {
    answerResponseList: [],
    assessmentId: -1,
    assessmentName: "",
    assessmentStatus: "",
    domain: "",
    industry: "",
    organisationName: "",
    parameterRatingAndRecommendation: [],
    teamSize: 0,
    topicRatingAndRecommendation: [],
    updatedAt: 0,
    users: []
  };

  constructor(public appService: AppServiceService, public router: Router, private dialog: MatDialog,) {
    this.dataSource = new MatTableDataSource<AssessmentStructure>(assessments)
  }

  assessments: AssessmentStructure[]

  assessmentModule(assessmentName: string) {
    this.router.navigateByUrl("assessmentModule", {state: {assessmentName: assessmentName}})
    return true
  }

  ngOnInit(): void {
    this.appService.getAssessments().subscribe(
      (response) => {
        assessments = response
        assessments.sort((assessment1, assessment2) => {
          const index = assessment1.assessmentStatus.localeCompare(assessment2.assessmentStatus)
          if (index != 0)
            return index;
          return assessment2.updatedAt - assessment1.updatedAt
        })
        valueEmitter.next(assessments)
      }
    )
    valueEmitter.subscribe((value) => {
      this.dataSource = new MatTableDataSource(value);
      this.dataSource.paginator = this.paginator;
    })

  }

  dataSource = new MatTableDataSource<AssessmentStructure>()
  columnsToDisplay = ['assessmentName', 'organisationName', 'assessmentStatus', 'updatedAt'];


  async openAssessment(content: any) {
    this.dialogRef = this.dialog.open(content, {
      width: '630px', height: '650px',
    })
    this.dialogRef.disableClose =true;
  }

}



