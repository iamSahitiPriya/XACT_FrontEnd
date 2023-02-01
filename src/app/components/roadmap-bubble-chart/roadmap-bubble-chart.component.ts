import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AppServiceService} from "../../services/app-service/app-service.service";
import {Subject, takeUntil} from "rxjs";
import {RecommendationResponse} from "../../types/recommendationsResponse";
import {BubbleChartStructure} from "../../types/bubbleChartStructure";
import {BubbleStructure} from "../../types/BubbleStructure";

@Component({
  selector: 'app-roadmap-bubble-chart',
  templateUrl: './roadmap-bubble-chart.component.html',
  styleUrls: ['./roadmap-bubble-chart.component.css']
})
export class RoadmapBubbleChartComponent implements OnInit, OnDestroy {

  @Input()
  assessmentId: number

  recommendationResponse: RecommendationResponse | undefined;

  recommendation: BubbleChartStructure [] = []

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private appService: AppServiceService) {
  }


  ngOnInit(): void {
    this.appService.getAllRecommendations(this.assessmentId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (_data) => {
        this.recommendationResponse = _data
        console.log(this.recommendationResponse)
        this.mapBubbleChartRecommendations(this.recommendationResponse)
      }
    })
  }


  multi: BubbleChartStructure [] = [
    {
      name: "Bags",
      series: [
        {
          name: "2000",
          x: 2.2,
          y: 2.3,
          r: 55
        }]
    },
    {
      name: "HELLO",
      series: [
        {
          name: "2010",
          x: 1.7,
          y: 2.9,
          r: 59
        }]
    },
    {
      name: "NDB",
      series: [
        {
          name: "2009",
          x: 1.5,
          y: 1.3,
          r: 60
        }]
    }
  ];


  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = "Delivery Horizon";
  showYAxisLabel = true;
  yAxisLabel = "Impact";
  xAxisTicks = [0, 1, 2, 3];
  yAxisTicks = [0, 1, 2, 3];

  xAxisTickFormatting(value: any): any {
    if (value > 0 && value <= 1)
      return "NOW";
    else if (value > 1 && value <= 2)
      return "NEXT";
    else if (value > 2 && value <= 3)
      return "LATER";
    else
      return " ";
  }

  yAxisTickFormatting(value: any): any {
    if (value > 0 && value <= 1)
      return "LOW";
    else if (value > 1 && value <= 2)
      return "MEDIUM";
    else if (value > 2 && value <= 3)
      return "HIGH";
    else
      return " ";
  }


  private mapBubbleChartRecommendations(recommendationResponse: RecommendationResponse) {
    let categoryLength : number = recommendationResponse.categoryRecommendations?.length
    recommendationResponse.categoryRecommendations?.forEach(eachCategoryRecommendations => {
      let count = 0
      let bubbles: BubbleStructure [] = []
      console.log("recommendations", eachCategoryRecommendations.recommendations)
      let length: number = eachCategoryRecommendations?.recommendations?.length
      eachCategoryRecommendations.recommendations?.forEach(eachRecommendation => {
        count += 1
        let bubble: BubbleStructure = {
          name: eachRecommendation.recommendation,
          x: this.calculateXPosition(eachRecommendation.deliveryHorizon, count),
          y: this.calculateYPosition(eachRecommendation.impact, count, length, categoryLength),
          r: this.calculateRadius(eachRecommendation.effort)
        }
        console.log("bubble", bubble)
        bubbles.push(bubble)
      })
      console.log("bubbles", bubbles)
      let chartCategoryRecommendations: BubbleChartStructure = {
        name: eachCategoryRecommendations.categoryName,
        series: bubbles
      };
      this.recommendation.push(chartCategoryRecommendations)
    })
    console.log("display", this.recommendation)
    console.log("multi", this.multi)
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private calculateXPosition(deliveryHorizon: string, count: number): number {
    if (deliveryHorizon === "NOW")
      return count * 0.1 + 0;
    else if (deliveryHorizon === "NEXT")
      return count * 0.1 + 1;
    else if (deliveryHorizon === "LATER")
      return count * 0.1 + 2;
    return 0;
  }

  private calculateYPosition(impact: string, count: number, length: number, categoryLength: number): number {
    if (impact === "LOW")
      return (length - count + 1) * 0.1 + 0;
    else if (impact === "MEDIUM")
      return (length - count + 1) * 0.1 + 1;
    else if (impact === "HIGH")
      return (length - count + 1) * 0.1 + 2;
    return 0;
  }

  private calculateRadius(effort: string): number {
    if (effort === "LOW")
      return 20;
    else if (effort === "MEDIUM")
      return 24;
    else if (effort === "HIGH")
      return 28;
    return 0;
  }
}
