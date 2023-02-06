import {Component, Input, OnInit} from '@angular/core';
import {BubbleChartStructure} from "../../types/bubbleChartStructure";
import {Recommendation} from "../../types/recommendation";

@Component({
  selector: 'app-recommendation-table',
  templateUrl: './recommendation-table.component.html',
  styleUrls: ['./recommendation-table.component.css']
})
export class RecommendationTableComponent {

  @Input()
  recommendations : Recommendation []
  deliveryHorizon: string = "";

  constructor() { }


  isDeliveryHorizonDisplayed(recommendation:Recommendation): boolean {
    if(this.deliveryHorizon !== recommendation.deliveryHorizon){
      this.deliveryHorizon = recommendation.deliveryHorizon
      return true;
    }
    return false;
  }
}
