import {Component} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

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
  dataSource = ELEMENT_DATA;
  columnsToDisplay = ['position','assessment_name', 'organisation_name', 'status', 'domain'];
  expandedElement: PeriodicElement | null;
}

export interface PeriodicElement {
  position: number;
  assessment_name: string;
  organisation_name: string;
  status: string;
  domain: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 1,
    assessment_name: 'Assessment1',
    organisation_name: 'XYZ Company',
    status: 'Active',
    domain: 'Telecom',
  },
  {
    position: 2,
    assessment_name: 'Hydrogen',
    organisation_name: 'XYZ Company',
    status: 'Pending',
    domain: 'Cal center',
  },
  {
    position: 3,
    assessment_name: 'Hydrogen',
    organisation_name: 'XYZ Company',
    status: 'Completed',
    domain: 'Telecom',
  },
  {
    position: 4,
    assessment_name: 'Hydrogen',
    organisation_name: 'XYZ Company',
    status: 'Active',
    domain: 'Telecom',
  },
  {
    position: 5,
    assessment_name: 'Some assessment',
    organisation_name: 'XYZ Company',
    status: 'Pending',
    domain: 'Telecom',
  },
];
