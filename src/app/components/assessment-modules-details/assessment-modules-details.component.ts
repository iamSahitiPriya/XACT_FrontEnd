import {Component, OnInit, ViewChild} from '@angular/core';
import {CategoryStructure} from "../../types/categoryStructure";
import {BehaviorSubject} from "rxjs";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {TopicStructure} from "../../types/topicStructure";
import {ModuleStructure} from "../../types/moduleStructure";
import {AssessmentStructure} from "../../types/assessmentStructure";
import {ParameterStructure} from "../../types/parameterStructure";
import {FunctionalitiesComponent} from "../functionalities/functionalities.component";

let categories: CategoryStructure[] = []
let valueEmitter = new BehaviorSubject<CategoryStructure[]>(categories)

@Component({
  selector: 'app-assessment-modules-details',
  templateUrl: './assessment-modules-details.component.html',
  styleUrls: ['./assessment-modules-details.component.css']
})
export class AssessmentModulesDetailsComponent implements OnInit {
  assessmentName: string
  moduleName: string
  assessment: AssessmentStructure[] = []
  category: CategoryStructure[] = []
  topics: TopicStructure[];
  parameters: ParameterStructure[];
  moduleSelected: number;
  topic: TopicStructure;
  parameter: ParameterStructure;
  topicName: string;
  selectedIndex: number = 0;

  constructor(private appService: AppServiceService) {
  }

  navigate(module: ModuleStructure) {
    this.moduleSelected = module.moduleId;
    this.topics = module.topics;
  }

  ngOnInit(): void {
    if (history.state.assessmentName) {
      this.assessmentName = history.state.assessmentName
      sessionStorage.setItem('assessmentName', JSON.stringify(this.assessmentName))
    } else {
      this.assessmentName = JSON.parse(sessionStorage.getItem('assessmentName') || "No value")
    }
    this.appService.getCategories().subscribe(data => {
      categories = data
      valueEmitter.next(categories)
    })
    valueEmitter.subscribe(data => {
      this.category = data
      this.navigate(this.category[0].modules[0])

    })
  }
  next(index:number){
    this.selectedIndex = index;
  }
  previous(index:number){
    this.selectedIndex = index;
  }

}
