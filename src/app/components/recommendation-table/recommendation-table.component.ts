import {Component, Input, OnInit} from '@angular/core';
import {BubbleChartStructure} from "../../types/bubbleChartStructure";
import {Recommendation} from "../../types/recommendation";
import {Color, index} from "d3";

@Component({
  selector: 'app-recommendation-table',
  templateUrl: './recommendation-table.component.html',
  styleUrls: ['./recommendation-table.component.css']
})
export class RecommendationTableComponent {

  @Input()
  recommendations : Recommendation []

  @Input()
  colorScheme :  Map<string,string>

  deliveryHorizon: string = "";
  categoryName : string = ""
  index : number = -1

  constructor() { }


  isDeliveryHorizonDisplayed(recommendation:Recommendation): boolean {
    if(this.deliveryHorizon !== recommendation.deliveryHorizon){
      this.deliveryHorizon = recommendation.deliveryHorizon
      return true;
    }
    return false;
  }

  colorCategory(categoryName: string) {
    return this.colorScheme.get(categoryName)
  }
}
