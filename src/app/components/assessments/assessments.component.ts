import {Component, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from '@angular/material/paginator';
import {AssessmentStructure} from "../../types/assessmentStructure";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {BehaviorSubject} from "rxjs";

/**
 * @title Table with expandable rows
 */
let assessments: AssessmentStructure[] = []
let valueEmitter = new BehaviorSubject<AssessmentStructure[]>(assessments)

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

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public appService: AppServiceService) {
    this.dataSource = new MatTableDataSource<AssessmentStructure>(assessments)
  }

  assessments: AssessmentStructure[]

  ngOnInit(): void {
    this.appService.getAssessments().subscribe(
      (response) => {
        assessments = response
        assessments.sort((assessment1,assessment2)=>{
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
  expandedElement: AssessmentStructure | null;
}




