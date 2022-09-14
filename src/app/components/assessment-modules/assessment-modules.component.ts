/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppServiceService} from "../../services/app-service/app-service.service";
import {CategoryStructure} from "../../types/categoryStructure";
import {BehaviorSubject, Subject, takeUntil} from "rxjs";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {data_local} from "../../messages";


let categories: CategoryStructure[] = []
let valueEmitter = new BehaviorSubject<CategoryStructure[]>(categories)


@Component({
  selector: 'app-assessment-modules',
  templateUrl: './assessment-modules.component.html',
  styleUrls: ['./assessment-modules.component.css']
})
export class AssessmentModulesComponent implements OnInit, OnDestroy {
  assessmentName: string
  category: CategoryStructure[] = []
  categoryIconMapping: Map<number, string> = new Map<number, string>()
  private destroy$: Subject<void> = new Subject<void>();

  assessmentModuleTitle = data_local.ASSESSMENT_MODULE.TITLE;

  constructor(private appService: AppServiceService, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer,) {
    matIconRegistry
      .addSvgIcon('default', this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/category-icons/Group 2577.svg'))
      .addSvgIcon('category1', this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/category-icons/Group 2577.svg'))
      .addSvgIcon('category2', this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/category-icons/Group 2425.svg'))
  }

  ngOnInit(): void {
    this.categoryIconMapping.set(1, "category1")
    this.categoryIconMapping.set(2, "category2")
    this.appService.getCategories().pipe(takeUntil(this.destroy$)).subscribe(data => {
      categories = data
      valueEmitter.next(categories)
    })
    valueEmitter.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.category = data
    })
  }

  getIcon(categoryId: number): string {
    return this.categoryIconMapping.get(categoryId) || "default";
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
