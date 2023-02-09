import {Component, Input} from '@angular/core';
import {Recommendation} from "../../types/recommendation";
import {data_local} from "../../messages";

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
  recommendationTitle: string = data_local.SUMMARY_REPORT.RECOMMENDATION.HEADING;
  impact: string = data_local.RECOMMENDATION_TEXT.IMPACT_LABEL;
  effort : string = data_local.RECOMMENDATION_TEXT.EFFORT

  isDeliveryHorizonDisplayed(recommendation:Recommendation): boolean {
    if(this.deliveryHorizon !== recommendation.deliveryHorizon){
      this.deliveryHorizon = recommendation.deliveryHorizon
      return true;
    }
    return false;
  }

  categoryColor(categoryName: string) {
    return this.colorScheme.get(categoryName)
  }
}
