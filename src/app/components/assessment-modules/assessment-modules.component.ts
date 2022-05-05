import {Component, OnInit} from '@angular/core';
import {AppServiceService} from "../../services/app-service/app-service.service";
import {CategoryStructure} from "../../types/categoryStructure";
import {BehaviorSubject} from "rxjs";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";

let categories: CategoryStructure[] = []
let valueEmitter = new BehaviorSubject<CategoryStructure[]>(categories)


@Component({
  selector: 'app-assessment-modules',
  templateUrl: './assessment-modules.component.html',
  styleUrls: ['./assessment-modules.component.css']
})
export class AssessmentModulesComponent implements OnInit {
  assessmentName: string
  category: CategoryStructure[] = []
  categoryIconMapping: Map<number, string> = new Map<number, string>()

  constructor(private appService: AppServiceService, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer,) {
    matIconRegistry
      .addSvgIcon('default', this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/category-icons/Group 2577.svg'))
      .addSvgIcon('category1', this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/category-icons/Group 2577.svg'))
      .addSvgIcon('category2', this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/category-icons/Group 2425.svg'))
  }

  ngOnInit(): void {
    this.categoryIconMapping.set(1, "category1")
    this.categoryIconMapping.set(2, "category2")
    if (history.state.assessmentName) {
      this.assessmentName = history.state.assessmentName
      sessionStorage.setItem('assessmentName', JSON.stringify(this.assessmentName))
    }
    this.appService.getCategories().subscribe(data => {
      categories = data
      valueEmitter.next(categories)
    })
    valueEmitter.subscribe(data => {
      this.category = data
    })
  }

  getIcon(categoryId: number): string {
    return this.categoryIconMapping.get(categoryId) || "default";
  }
}
