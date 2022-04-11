import {Component} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatTableDataSource} from "@angular/material/table";
import {AssessmentStructure} from "./assessmentStructure";

/**
 * @title Table with expandable rows
 */
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
export class AssessmentsComponent {
  dataSource = new MatTableDataSource(ASSESSMENT_DATA);
  columnsToDisplay = ['assessment_name', 'organisation_name','status', 'lastSavedDate'];
  expandedElement: AssessmentStructure | null;
}
export const ASSESSMENT_DATA: AssessmentStructure[] = [
  {
    position: 1,
    assessment_name: 'Assessment1',
    organisation_name: 'XYZ Company',
    status: 'Active',
    lastSavedDate: new Date(2000,7,23),
  },
  {
    position: 2,
    assessment_name: 'Hydrogen',
    organisation_name: 'XYZ Company',
    status: 'Pending',
    lastSavedDate: new Date(2021,6,10),
  },
  {
    position: 3,
    assessment_name: 'Hydrogen',
    organisation_name: 'XYZ Company',
    status: 'Completed',
    lastSavedDate: new Date(2005,4,22),
  },
  {
    position: 4,
    assessment_name: 'Hydrogen',
    organisation_name: 'XYZ Company',
    status: 'Active',
    lastSavedDate: new Date(2020,6,3),
  },
  {
    position: 5,
    assessment_name: 'Some assessment',
    organisation_name: 'XYZ Company',
    status: 'Pending',
    lastSavedDate:new Date(2000,8,5),
  },
];
