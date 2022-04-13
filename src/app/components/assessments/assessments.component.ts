import {Component,OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatTableDataSource} from "@angular/material/table";
import {AssessmentStructure} from "./assessmentStructure";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {BehaviorSubject} from "rxjs";

/**
 * @title Table with expandable rows
 */
let assessments:AssessmentStructure[] = []
let testEmitter$ = new BehaviorSubject<AssessmentStructure[]>(assessments)

@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class AssessmentsComponent implements OnInit {

  constructor(public appService: AppServiceService) {
    this.dataSource = new MatTableDataSource<AssessmentStructure>(assessments)
  }
  assessments:AssessmentStructure[]
  ngOnInit(): void {
    this.appService.getAssessments().subscribe(
      (response) => {
        assessments = response
        testEmitter$.next(assessments)
      }
    )
    testEmitter$.subscribe((value)=>
    {
      this.dataSource = new MatTableDataSource(value)})
  }

  dataSource = new MatTableDataSource<AssessmentStructure>()

  columnsToDisplay = ['assessmentName','organisation.organisationName','assessmentStatus','updatedAt'];
  expandedElement: AssessmentStructure | null;
}

export const ASSESSMENT_DATA:AssessmentStructure [] = [
  {
    "assessmentId": 1,
    "assessmentName": "xact",
    "organisation": {
      "organisationId": 2,
      "organisationName": "abc",
      "industry": "hello",
      "domain": "ABC",
      "size": 4
    },
    "description": "project for xact",
    "assessmentStatus": "ACTIVE",
    "createdAt": 1649836699000,
    "updatedAt": 1649836702000
  }
]


