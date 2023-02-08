import {Component, Input} from '@angular/core';
import {Recommendation} from "../../types/recommendation";

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
