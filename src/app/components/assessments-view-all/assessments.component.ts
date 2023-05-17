/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from '@angular/material/paginator';
import {AssessmentStructure} from "../../types/assessmentStructure";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {BehaviorSubject, Subject, takeUntil} from "rxjs";
import {Router} from "@angular/router";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {data_local} from "../../messages";
import {MatSort} from '@angular/material/sort';

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

export class AssessmentsComponent implements OnInit, OnDestroy {

  hideTooltip: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  private dialogRef: MatDialogRef<any>;
  blankAssessment: AssessmentStructure = {
    userQuestionResponseList: [],
    answerResponseList: [],
    assessmentId: -1,
    assessmentName: "",
    assessmentPurpose: "",
    assessmentDescription:"",
    assessmentStatus: "",
    domain: "",
    assessmentState: "",
    industry: "",
    organisationName: "",
    parameterRatingAndRecommendation: [],
    teamSize: undefined,
    topicRatingAndRecommendation: [],
    updatedAt: 0,
    users: [],
    owner:false
  };

  homePageTitle = data_local.HOME.TITLE;
  createAssessment = data_local.HOME.BUTTON;
  assessmentNameHeading = data_local.HOME.TABLE_HEADING.ASSESSMENT_NAME;
  organisationNameHeading = data_local.HOME.TABLE_HEADING.ORGANISATION_NAME;
  statusHeading = data_local.HOME.TABLE_HEADING.STATUS;
  lastUpdatedHeading = data_local.HOME.TABLE_HEADING.LAST_UPDATED;
  toolTipAssessmentCol = data_local.HOME.ASSESSMENT_TOOLTIP;
  toolTipSortingCol = data_local.HOME.SORTING_TOOLTIP;
  assessmentNotAvailable = data_local.HOME.ERROR_MESSAGE.ASSESSMENT_UNAVAILABLE;
  buttonToolTip = data_local.HOME.BUTTON_TOOLTIP;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(public appService: AppServiceService, public router: Router, private dialog: MatDialog,) {
    this.dataSource = new MatTableDataSource<AssessmentStructure>(assessments)
  }

  assessments: AssessmentStructure[]


  ngOnInit(): void {
    this.appService.getAssessments().pipe(takeUntil(this.destroy$)).subscribe(
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
    valueEmitter.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.dataSource = new MatTableDataSource(value);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
        if (typeof data[sortHeaderId] === 'string') {
          return data[sortHeaderId].toLocaleLowerCase();
        }
        return data[sortHeaderId];
      };
      this.dataSource.sort = this.sort;
    })
  }

  dataSource = new MatTableDataSource<AssessmentStructure>()
  columnsToDisplay: string[] = ['assessmentName', 'organisationName', 'assessmentStatus', 'updatedAt', 'link'];
  assessmentTable: string = "assessmentTable";


  async openAssessment(content: any) {
    this.dialogRef = this.dialog.open(content, {
      panelClass: ['create-assessment-popup']
    })
    this.dialogRef.disableClose = true;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigation(drafted: string, assessmentId: number) {
      drafted === "inProgress" ? this.router.navigateByUrl("assessment/" + assessmentId, {state: {type: 'table'}}) : this.router.navigateByUrl("assessmentModule/" + assessmentId, {state: {type: 'table'}});

  }

}




