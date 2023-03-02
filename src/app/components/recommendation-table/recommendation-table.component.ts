import {Component, Input, OnInit} from '@angular/core';
import {Recommendation} from "../../types/recommendation";
import {data_local} from "../../messages";

interface RecommendationTableData {
  deliveryHorizon: string
  recommendations: RecommendationRow[]
}

interface RecommendationRow {
  recommendationCount: number
  recommendation: Recommendation
}


@Component({
  selector: 'app-recommendation-table',
  templateUrl: './recommendation-table.component.html',
  styleUrls: ['./recommendation-table.component.css']
})


export class RecommendationTableComponent implements OnInit {

  tableData: RecommendationTableData[] = []
  @Input()
  recommendations : Recommendation []

  index: number = 0;
  @Input()
  colorScheme :  Map<string,string>

  deliveryHorizon: string | undefined = undefined;
  @Input()
  assessmentId: number

  recommendationTitle: string = data_local.SUMMARY_REPORT.RECOMMENDATION.HEADING;
  impact: string = data_local.RECOMMENDATION_TEXT.IMPACT_LABEL;
  effort: string = data_local.RECOMMENDATION_TEXT.EFFORT
  deliveryHorizonTitle: string = data_local.RECOMMENDATION_TEXT.DELIVERY_HORIZON
  now: string = data_local.RECOMMENDATION_TEXT.DH_1.toUpperCase();
  next: string = data_local.RECOMMENDATION_TEXT.DH_2.toUpperCase();
  later: string = data_local.RECOMMENDATION_TEXT.DH_3.toUpperCase();
  nowDeliveryHorizonIndex: number = 0;
  nextDeliveryHorizonIndex: number = 1;
  laterDeliveryHorizonIndex: number = 2;

  ngOnInit() {
    let nowDeliveryHorizonRecommendation: RecommendationTableData = {deliveryHorizon: this.now, recommendations: []};
    let nextDeliveryHorizonRecommendation: RecommendationTableData = {deliveryHorizon: this.next, recommendations: []};
    let laterDeliveryHorizonRecommendation: RecommendationTableData = {
      deliveryHorizon: this.later,
      recommendations: []
    };
    this.tableData.push(nowDeliveryHorizonRecommendation, nextDeliveryHorizonRecommendation, laterDeliveryHorizonRecommendation)
    this.formatDataForTable(this.recommendations)
  }

  formatDataForTable(recommendations: Recommendation[]) {
    let count = 0;
    recommendations.forEach(recommendation => {
        count += 1;
        this.groupRecommendationByDeliveryHorizon(count, recommendation, this.tableData);
      }
    )
  }

  private groupRecommendationByDeliveryHorizon(count: number, recommendation: Recommendation, tableData: RecommendationTableData[]) {
    let recommendationRow: RecommendationRow = {recommendationCount: count, recommendation: recommendation}

    if (recommendation.deliveryHorizon === this.now) {
      tableData[this.nowDeliveryHorizonIndex].recommendations.push(recommendationRow)
    } else if (recommendation.deliveryHorizon === this.next) {
      tableData[this.nextDeliveryHorizonIndex].recommendations.push(recommendationRow)
    } else {
      tableData[this.laterDeliveryHorizonIndex].recommendations.push(recommendationRow)
    }
  }

  categoryColor(categoryName: string) {
    return this.colorScheme.get(categoryName)
  }
}
