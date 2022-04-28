import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-assessment-modules',
  templateUrl: './assessment-modules.component.html',
  styleUrls: ['./assessment-modules.component.css']
})
export class AssessmentModulesComponent implements OnInit {
  assessmentName:string
  constructor() {
    this.assessmentName = history.state.assessmentName
  }

  ngOnInit(): void {
      console.log(this.assessmentName)
  }

}
