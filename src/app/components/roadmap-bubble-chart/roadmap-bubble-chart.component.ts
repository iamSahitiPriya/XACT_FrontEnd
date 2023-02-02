import {AfterContentChecked, AfterViewChecked, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AppServiceService} from "../../services/app-service/app-service.service";
import {Subject, takeUntil} from "rxjs";
import {RecommendationResponse} from "../../types/recommendationsResponse";
import {BubbleChartStructure} from "../../types/bubbleChartStructure";
import {BubbleStructure} from "../../types/BubbleStructure";
import * as d3 from 'd3';
import {LegendPosition} from "@swimlane/ngx-charts";


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

  contentLoaded: number = 0
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

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = "Delivery Horizon";
  showYAxisLabel = true;
  yAxisLabel = "Impact";
  xAxisTicks = [0, 1, 2, 3];
  yAxisTicks = [0, 1, 2, 3];
  xTicks =" "
  tickFormat(){
    return ""
  }


  private mapBubbleChartRecommendations(recommendationResponse: RecommendationResponse) {
    let categoryLength : number = recommendationResponse.categoryRecommendations?.length
    recommendationResponse.categoryRecommendations?.forEach(eachCategoryRecommendations => {
      let count = 0
      let bubbles: BubbleStructure [] = []
      let length: number = eachCategoryRecommendations?.recommendations?.length
      eachCategoryRecommendations.recommendations?.forEach(eachRecommendation => {
        count += 1
        let bubble: BubbleStructure = {
          name: eachRecommendation.recommendation,
          x: this.calculateXPosition(eachRecommendation.deliveryHorizon, count),
          y: this.calculateYPosition(eachRecommendation.impact, count, length, categoryLength),
          r: this.calculateRadius(eachRecommendation.effort)
        }
        bubbles.push(bubble)
      })
      let chartCategoryRecommendations: BubbleChartStructure = {
        name: eachCategoryRecommendations.categoryName,
        series: bubbles
      };
      this.recommendation.push(chartCategoryRecommendations)
    })
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

  getText() {
    let count = 0;
    d3.select("ngx-charts-bubble-chart")
      .select("svg").select("g").selectAll(".circle")
      .attr("fill","red")
      .append("svg:text").text(() => count = count+1).attr("x",0).attr("y",5).attr("text-anchor","middle")
      .attr("fill", "white")
      .attr("fill-opacity", 1)
      .style("font", "18px Inter")
  }
  // ngAfterContentChecked() {
  //   console.log(this.contentLoaded)
  //   if(this.contentLoaded < 3) {
  //     console.log("called")
  //     this.getText();
  //     this.contentLoaded += 1;
  //   }
  // }

}
