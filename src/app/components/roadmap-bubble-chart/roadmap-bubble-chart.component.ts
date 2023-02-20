import {AfterContentChecked, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AppServiceService} from "../../services/app-service/app-service.service";
import {Subject, takeUntil} from "rxjs";
import {BubbleChartStructure} from "../../types/bubbleChartStructure";
import {BubbleStructure} from "../../types/BubbleStructure";
import * as d3 from 'd3';
import {Recommendation} from "../../types/recommendation";
import {Color, ScaleType} from "@swimlane/ngx-charts";
import {data_local} from "../../messages";


const LOW_NOW_LIMIT = 0;
const MEDIUM_NEXT_LIMIT = 1;
const HIGH_LATER_LIMIT = 2;
const LOW_EFFORT_RADIUS = 20;
const MEDIUM_EFFORT_RADIUS = 24;
const HIGH_EFFORT_RADIUS = 26;

interface Coordinates {
  x : number
  y: number
}
@Component({
  selector: 'app-roadmap-bubble-chart',
  templateUrl: './roadmap-bubble-chart.component.html',
  styleUrls: ['./roadmap-bubble-chart.component.css']
})
export class RoadmapBubbleChartComponent implements OnInit, OnDestroy, AfterContentChecked{

  @Input()
  assessmentId: number

  recommendationResponse: Recommendation [] = [];

  recommendations: BubbleChartStructure [] = []

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisTicks = [0, 1, 2, 3];
  yAxisTicks = [0, 1, 2, 3];
  xTicks = " "
  autoScale: boolean = false;
  minBubbleRadius: number = 20;
  maxBubbleRadius: number = 28;
  showYAxisTicks: number[] = [0, 1, 2, 3];
  showXAxisTicks: number[] = [0, 1, 2, 3];
  yScaleMin: number = 0;
  yScaleMax: number = 3;
  xScaleMin: number = 0;
  xScaleMax: number = 3;
  height: number = 600;
  position : Coordinates[] = [
    {x: 0.495, y: 0.41}, {x:0.25,y:0.871}, {x: 0.699, y: 0.428}, {x: 0.7, y: 0.881}, {x: 0.095, y: 0.17},
    {x: 0.799, y: 0.628}, {x: 0.61, y: 0.1712}, {x: 0.346, y: 0.407}, {x: 0.217, y: 0.582}, {x: 0.89, y: 0.881},
    {x: 0.252,y: 0.169}, {x: 0.919, y: 0.438}, {x: 0.092, y: 0.855}, {x: 0.939, y: 0.151}, {x: 0.0795, y: 0.518},
    {x: 0.577, y: 0.608}, {x: 0.434, y: 0.168}, {x: 0.39, y: 0.692}, {x: 0.772, y: 0.136}, {x: 0.498, y: 0.88} ]

  lowImpact = data_local.RECOMMENDATION_TEXT.IMPACT_3;
  mediumImpact = data_local.RECOMMENDATION_TEXT.IMPACT_2;
  highImpact = data_local.RECOMMENDATION_TEXT.IMPACT_1;

  lowEffort = data_local.RECOMMENDATION_TEXT.EFFORT_3;
  mediumEffort = data_local.RECOMMENDATION_TEXT.EFFORT_2;
  highEffort = data_local.RECOMMENDATION_TEXT.EFFORT_1;

  nowDeliveryHorizon = data_local.RECOMMENDATION_TEXT.DH_1;
  nextDeliveryHorizon = data_local.RECOMMENDATION_TEXT.DH_2;
  laterDeliveryHorizon = data_local.RECOMMENDATION_TEXT.DH_3;

  roadmapTitle: string = data_local.SUMMARY_REPORT.ROADMAP_CHART.TITLE;
  impact: string = data_local.RECOMMENDATION_TEXT.IMPACT_LABEL;
  deliveryHorizon = data_local.RECOMMENDATION_TEXT.DELIVERY_HORIZON;
  noRecommendationMessage: string = data_local.SUMMARY_REPORT.ROADMAP_CHART.NO_RECOMMENDATION_MESSAGE;
  recommendationTitle: string = data_local.SUMMARY_REPORT.RECOMMENDATION.TITLE;
  category: string = data_local.SUMMARY_REPORT.ROADMAP_CHART.LEGEND_TITLE;

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


  getRecommendations() {
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
    let xCoordinate = this.position[count%this.position.length].x
    if (deliveryHorizon === this.nowDeliveryHorizon.toUpperCase())
      xCoordinate += LOW_NOW_LIMIT
    else if (deliveryHorizon === this.nextDeliveryHorizon.toUpperCase())
      xCoordinate += MEDIUM_NEXT_LIMIT
    else if (deliveryHorizon === this.laterDeliveryHorizon.toUpperCase())
      xCoordinate += HIGH_LATER_LIMIT
    return xCoordinate;
  };

  private yPosition = (impact: string, count: number): number => {
    let yCoordinate =  this.position[count%this.position.length].y
    if (impact === this.lowImpact.toUpperCase())
      yCoordinate += LOW_NOW_LIMIT
    else if (impact === this.mediumImpact.toUpperCase())
      yCoordinate += MEDIUM_NEXT_LIMIT
    else if (impact === this.highImpact.toUpperCase())
      yCoordinate += HIGH_LATER_LIMIT
    return yCoordinate;
  };


  private radius = (effort: string): number => {
    let radius = 0;
    if (effort === this.lowEffort.toUpperCase())
      radius = LOW_EFFORT_RADIUS;
    else if (effort === this.mediumEffort.toUpperCase())
      radius = MEDIUM_EFFORT_RADIUS;
    else if (effort === this.highEffort.toUpperCase())
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

  ngAfterContentChecked() {
    this.labelRoadmapChart();
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
