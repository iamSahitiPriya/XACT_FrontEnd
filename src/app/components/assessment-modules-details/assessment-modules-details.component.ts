import {Component, OnInit} from '@angular/core';
import {CategoryStructure} from "../../types/categoryStructure";
import {BehaviorSubject} from "rxjs";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {TopicStructure} from "../../types/topicStructure";
import {ModuleStructure} from "../../types/moduleStructure";

let categories: CategoryStructure[] = []
let valueEmitter = new BehaviorSubject<CategoryStructure[]>(categories)

@Component({
  selector: 'app-assessment-modules-details',
  templateUrl: './assessment-modules-details.component.html',
  styleUrls: ['./assessment-modules-details.component.css']
})
export class AssessmentModulesDetailsComponent implements OnInit {
  assessmentName: string
  moduleName:string
  category: CategoryStructure[] = []
  topics: TopicStructure[];

  constructor(private appService: AppServiceService) {
  }

  navigate(moduleName: ModuleStructure){
   this.topics=moduleName.topics;
  }



  ngOnInit(): void {

    if (history.state.assessmentName) {
      this.assessmentName = history.state.assessmentName
      sessionStorage.setItem('assessmentName', JSON.stringify(this.assessmentName))
    }
    else {
      this.assessmentName = JSON.parse(sessionStorage.getItem('assessmentName') || "No value")

    }
    this.appService.getCategories().subscribe(data => {
      categories = data
      valueEmitter.next(categories)
    })
    valueEmitter.subscribe(data => {
      this.category = data
    })
  }
}
