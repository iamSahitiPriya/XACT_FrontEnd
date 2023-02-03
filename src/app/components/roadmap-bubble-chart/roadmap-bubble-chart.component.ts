import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AppServiceService} from "../../services/app-service/app-service.service";
import {Subject, takeUntil} from "rxjs";
import {BubbleChartStructure} from "../../types/bubbleChartStructure";
import {BubbleStructure} from "../../types/BubbleStructure";
import * as d3 from 'd3';
import {Recommendation} from "../../types/recommendation";
import {log} from "util";


@Component({
  selector: 'app-roadmap-bubble-chart',
  templateUrl: './roadmap-bubble-chart.component.html',
  styleUrls: ['./roadmap-bubble-chart.component.css']
})
export class RoadmapBubbleChartComponent implements OnInit, OnDestroy {

  @Input()
  assessmentId: number

  recommendationResponse: Recommendation [] | undefined;

  recommendation: BubbleChartStructure [] = []

  private symbol : string[] = ["PLUS","MINUS"]
  private  positions : any[] = []

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private appService: AppServiceService) {
  }


  ngOnInit(): void {
    this.appService.getAllRecommendations(this.assessmentId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (_data) => {
        this.recommendationResponse = _data
        this.mapBubbleChartRecommendations(this.recommendationResponse)
      }
    })
  }

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
  xTicks =" "
  tickFormat(){
    return ""
  }


  private mapBubbleChartRecommendations(recommendationResponse: Recommendation []) {
    recommendationResponse?.forEach(eachRecommendation => {
      let bubbles: BubbleStructure [] = []
      let position : any =  this.calculatePosition(eachRecommendation)
        let bubble: BubbleStructure = {
          name: eachRecommendation.recommendation,
          x: position.x,
          y: position.y,
          r: this.calculateRadius(eachRecommendation.effort)
        }
      console.log("x",position.x, " y", position.y, eachRecommendation.deliveryHorizon, eachRecommendation.impact, eachRecommendation.effort)

        bubbles.push(bubble)
      let chartCategoryRecommendations: BubbleChartStructure = {
        name: eachRecommendation.categoryName,
        series: bubbles
      };
      this.recommendation.push(chartCategoryRecommendations)
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private calculateXPosition(recommendation: Recommendation): number {
    if (recommendation.deliveryHorizon === "NOW")
      return this.calculateValue(0,1,(0+1)/2);
    else if (recommendation.deliveryHorizon === "NEXT")
      return this.calculateValue(1,2,(1+2)/2);
    else if (recommendation.deliveryHorizon === "LATER")
      return this.calculateValue(2,3,(2+3)/2);
    return 0;
  }

  private calculateYPosition(recommendation : Recommendation): number {
    if (recommendation.impact === "LOW")
      return this.calculateValue(0,1,(0+1)/2);
    else if (recommendation.impact === "MEDIUM")
      return this.calculateValue(1,2,(1+2)/2);
    else if (recommendation.impact === "HIGH")
      return this.calculateValue(2,3,(2+3)/2);
    return 0;
  }

  private calculateValue(min: number, max: number, mid: number) : number {
    let position : number = 0.0;
    let randomIndex = Math.floor(Math.random() * this.symbol.length);
    if(this.symbol[randomIndex] === "PLUS") {
      position = Number(((Math.random() * ((max - 0.25) - mid) + mid) + (Math.random() * (0.30 - 0.2) + 0.2)).toFixed(1));
      // console.log("plus",position, min, max, mid)
    }
    if(this.symbol[randomIndex] === "MINUS") {
      position = Number(((Math.random() * (mid - (min + 0.25)) + (min + 0.25))-(Math.random() * (0.30 - 0.2) + 0.2)).toFixed(1));
      // console.log("minus",position,min, max, mid)
    }

    return position;
  }

  private calculatePosition(recommendation: Recommendation) : any{
    // console.log(recommendation.deliveryHorizon, recommendation.impact)
    let x = this.calculateXPosition(recommendation)
    let y = this.calculateYPosition(recommendation)
    let position : any = {x,y}
    let isPositionPresent = this.positions.find(eachPosition => eachPosition.x === position.x && eachPosition.y === position.y)
    while(isPositionPresent !== undefined || this.isInteger(position) || !this.isNumberInRange(position)) {
      x = this.calculateXPosition(recommendation)
      y = this.calculateYPosition(recommendation)
      position = {x,y}
    }
    this.positions.push(position)

    return position;
    }

    private isInteger(position : any) : boolean {
    return Number.isInteger(position.x) || Number.isInteger(position.y);
    }

    private isNumberInRange(position : any) : boolean {
    return position.x > 0 && position.x < 3 && position.y > 0 && position.y < 3;
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
