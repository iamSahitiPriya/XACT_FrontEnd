import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-assessment-modules',
  templateUrl: './assessment-modules.component.html',
  styleUrls: ['./assessment-modules.component.css']
})
export class AssessmentModulesComponent implements OnInit {
  assessmentName:string
  constructor() {
  }

  ngOnInit(): void {
    if(history.state.assessmentName) {
      this.assessmentName = history.state.assessmentName
      sessionStorage.setItem('assessmentName', JSON.stringify(this.assessmentName))
    }else{
      this.assessmentName = JSON.parse(sessionStorage.getItem('assessmentName') ||"No value")
    }
  }

}
