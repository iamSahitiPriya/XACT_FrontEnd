import {Component, OnInit} from '@angular/core';
import {AppServiceService} from "../../services/app-service/app-service.service";
import {CategoryStructure} from "../../types/categoryStructure";
import {BehaviorSubject} from "rxjs";

let categories:CategoryStructure[] = []
let valueEmitter = new BehaviorSubject<CategoryStructure[]>(categories)


@Component({
  selector: 'app-assessment-modules',
  templateUrl: './assessment-modules.component.html',
  styleUrls: ['./assessment-modules.component.css']
})
export class AssessmentModulesComponent implements OnInit {
  assessmentName:string
  category:CategoryStructure[] = []
  constructor(private appService:AppServiceService) {
  }

  ngOnInit(): void {
    if(history.state.assessmentName) {
      this.assessmentName = history.state.assessmentName
      sessionStorage.setItem('assessmentName', JSON.stringify(this.assessmentName))
    }else{
      this.assessmentName = JSON.parse(sessionStorage.getItem('assessmentName') ||"No value")
    }
    this.appService.getCategories().subscribe(data =>{
      categories = data
      valueEmitter.next(categories)
    })
    valueEmitter.subscribe(data=>{
      this.category = data
    })
  }

}
