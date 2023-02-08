import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AppServiceService} from "../../services/app-service/app-service.service";
import {Subject, takeUntil} from "rxjs";
import {BubbleChartStructure} from "../../types/bubbleChartStructure";
import {BubbleStructure} from "../../types/BubbleStructure";
import * as d3 from 'd3';
import {Recommendation} from "../../types/recommendation";
import {Color, ScaleType} from "@swimlane/ngx-charts";
import {data_local} from "../../messages";

const NOW_THRESHOLD_VALUE = 0.099;
const NEXT_THRESHOLD_VALUE = 1.099;
const LATER_THRESHOLD_VALUE = 2.099;
const LOW_IMPACT_LIMIT = 1;
const MEDIUM_IMPACT_LIMIT = 2;
const HIGH_IMPACT_LIMIT = 3;
const LOW_EFFORT_RADIUS = 20;
const MEDIUM_EFFORT_RADIUS = 24;
const HIGH_EFFORT_RADIUS = 28;

@Component({
  selector: 'app-roadmap-bubble-chart',
  templateUrl: './roadmap-bubble-chart.component.html',
  styleUrls: ['./roadmap-bubble-chart.component.css']
})
export class RoadmapBubbleChartComponent implements OnInit, OnDestroy {

  @Input()
  assessmentId: number

  recommendationResponse: Recommendation [] = [];

  recommendations: BubbleChartStructure [] = []

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
  xTicks = " "
  autoScale: boolean = false;
  minBubbleRadius: number = 20;
  maxBubbleRadius: number = 30;
  showYAxisTicks: number[] = [0, 1, 2, 3];
  showXAxisTicks: number[] = [0, 1, 2, 3];
  yScaleMin: number = 0;
  yScaleMax: number = 3;
  xScaleMin: number = 0;
  xScaleMax: number = 3;

  lowImpact = data_local.RECOMMENDATION_TEXT.IMPACT_3.toUpperCase();
  mediumImpact = data_local.RECOMMENDATION_TEXT.IMPACT_2.toUpperCase();
  highImpact = data_local.RECOMMENDATION_TEXT.IMPACT_1.toUpperCase();

  lowEffort = data_local.RECOMMENDATION_TEXT.EFFORT_3.toUpperCase();
  mediumEffort = data_local.RECOMMENDATION_TEXT.EFFORT_2.toUpperCase();
  highEffort = data_local.RECOMMENDATION_TEXT.EFFORT_1.toUpperCase();

  tickFormat() {
    return ""
  }

  colorScheme: Color = {
    name: 'Color',
    domain: ["#634F7D", "#F15F79", "#6B9F78", "#CC850A", "#003D4F", "#47A1AD", "#9A2D40", "#1D3650", "#7A4F06", "#3E6044", "#005E7A"],
    selectable: true,
    group: ScaleType.Linear
  }

  categoryColor = new Map();

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private appService: AppServiceService) {
  }

  ngOnInit(): void {
    this.getRecommendations();
  }


  private getRecommendations() {
    this.appService.getAllRecommendations(this.assessmentId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (_data) => {
        this.recommendationResponse = _data
        this.mapRoadmapRecommendations(this.recommendationResponse)
      }
    })
  }

  private mapRoadmapRecommendations(recommendationResponse: Recommendation []) {
    let count = 0;
    let delHorizon = ""
    let impact = ""
    recommendationResponse?.forEach(eachRecommendation => {
        let recommendationSeries: BubbleStructure [] = []
        if (delHorizon !== eachRecommendation.deliveryHorizon || impact !== eachRecommendation.impact) {
          delHorizon = eachRecommendation.deliveryHorizon;
          impact = eachRecommendation.impact
          count = 0;
        }
        let recommendationBubble = this.recommendationBubble(eachRecommendation, count);
        count++;
        recommendationSeries.push(recommendationBubble)
        this.setCategoryColor(eachRecommendation);
        this.addRoadmapRecommendationSeries(eachRecommendation, recommendationSeries);
      }
    )
  }

  private addRoadmapRecommendationSeries(eachRecommendation: Recommendation, recommendationSeries: BubbleStructure[]) {
    let categoryRecommendation: BubbleChartStructure = {
      name: eachRecommendation.categoryName,
      series: recommendationSeries
    };
    this.recommendations.push(categoryRecommendation)
  }

  private recommendationBubble(eachRecommendation: Recommendation, count: number) {
    let recommendationBubble: BubbleStructure = {
      name: eachRecommendation.recommendation,
      x: this.xPosition(eachRecommendation.deliveryHorizon, count),
      y: this.yPosition(eachRecommendation.impact, count),
      r: this.radius(eachRecommendation.effort)
    }
    return recommendationBubble;
  }

  private setCategoryColor(eachRecommendation: Recommendation) {
    if (!this.categoryColor.has(eachRecommendation.categoryName))
      this.categoryColor.set(eachRecommendation.categoryName, this.colorScheme.domain[this.categoryColor.size % this.colorScheme.domain.length])
  }


  private xPosition = (deliveryHorizon: string, count: number): number => {
    const maxRecommendation = 6;
    const bubbleSeparator = 0.15;
    let xCoordinate = bubbleSeparator * (count % maxRecommendation);
    if (deliveryHorizon === "NOW")
      xCoordinate += NOW_THRESHOLD_VALUE
    else if (deliveryHorizon === "NEXT")
      xCoordinate += NEXT_THRESHOLD_VALUE
    else if (deliveryHorizon === "LATER")
      xCoordinate += LATER_THRESHOLD_VALUE;
    return xCoordinate;
  };

  private yPosition = (impact: string, count: number): number => {
    const bubbleSeparator = 0.057;
    const additionalGap = 0.18;
    let yCoordinate = (bubbleSeparator * count + additionalGap)
    if (impact === this.lowImpact)
      yCoordinate = LOW_IMPACT_LIMIT - yCoordinate;
    else if (impact === this.mediumImpact)
      yCoordinate = MEDIUM_IMPACT_LIMIT - yCoordinate;
    else if (impact === this.highImpact)
      yCoordinate = HIGH_IMPACT_LIMIT - yCoordinate;
    return yCoordinate;
  };


  private radius = (effort: string): number => {
    let radius = 0;
    if (effort === this.lowEffort)
      radius = LOW_EFFORT_RADIUS;
    else if (effort === this.mediumEffort)
      radius = MEDIUM_EFFORT_RADIUS;
    else if (effort === this.highEffort)
      radius = HIGH_EFFORT_RADIUS;
    return radius;
  };

  labelRoadmapChart() {
    let count = 0;
    d3.select("ngx-charts-bubble-chart")
      .select("svg").select("g").selectAll(".circle")
      .attr("fill", "red")
      .append("svg:text").text(() => count = count + 1).attr("x", 0).attr("y", 5).attr("text-anchor", "middle")
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
