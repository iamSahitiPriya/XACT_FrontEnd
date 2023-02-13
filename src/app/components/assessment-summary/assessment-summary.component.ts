/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, ElementRef, OnDestroy, OnInit, Optional, ViewChild} from '@angular/core';
import * as d3 from 'd3';
import {ScaleOrdinal} from 'd3';
import {AppServiceService} from "../../services/app-service/app-service.service";
import {ActivatedRoute} from "@angular/router";
import * as fromActions from "../../actions/assessment-data.actions";
import {Store} from "@ngrx/store";
import {AppStates} from "../../reducers/app.states";
import {ReportDataStructure} from "../../types/ReportDataStructure";
import {data_local} from "../../messages";
import {Observable, Subject, takeUntil} from "rxjs";
import html2canvas from "html2canvas";
import {SummaryResponse} from "../../types/summaryResponse";
import {LegendPosition} from "@swimlane/ngx-charts";
import {CategoryModulesRating} from "../../types/categoryModulesRating";
import {ModulesOverAllRating} from "../../types/modulesOverAllRating";
import {ModuleRatingTypes} from "../../types/moduleRatingTypes";
import {StackedBarChartColorScheme} from "../../types/stackedBarChartColorScheme";
import {AssessmentStructure} from "../../types/assessmentStructure";


interface ColorScheme {
  value?: ((value: number) => string) | string,
  viewValue: string,
  textColor: string
}

@Component({
  selector: 'app-assessment-sunburst-chart',
  templateUrl: './assessment-summary.component.html',
  styleUrls: ['./assessment-summary.component.css']
})


export class AssessmentSummaryComponent implements OnInit, OnDestroy {

  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;

  downloadActionTooltip = data_local.SUMMARY_REPORT.DOWNLOAD_ACTION_TOOLTIP;
  goBackToDashboard = data_local.ASSESSMENT_MENU.GO_BACK;
  instructionPanel = data_local.SUMMARY_REPORT.INSTRUCTION
  moduleAssessed = data_local.SUMMARY_REPORT.MODULE_ASSESSED;
  categoryAssessed = data_local.SUMMARY_REPORT.CATEGORY_ASSESSED;
  topicAssessed = data_local.SUMMARY_REPORT.TOPIC_ASSESSED;
  parameterAssessed = data_local.SUMMARY_REPORT.PARAMETER_ASSESSED;
  questionAnswered = data_local.SUMMARY_REPORT.QUESTION_ANSWERED;
  noDataAvailableText = data_local.SUMMARY_REPORT.NO_DATA_AVAILABLE;
  colorThemeHeading = data_local.SUMMARY_REPORT.COLOUR_THEME_HEADING;
  stackedBarChartTitle = data_local.OVERALL_CHART_TEXT.CHART_TITLE;
  targetRatingTitle = data_local.OVERALL_CHART_TEXT.TARGET_RATING_TITLE;
  currentRatingTitle = data_local.OVERALL_CHART_TEXT.CURRENT_RATING_TITLE
  assessmentId: number;
  assessmentDescription: string;
  assessmentData: Observable<AssessmentStructure>
  data: ReportDataStructure;
  summaryData: SummaryResponse;
  selectedValue: any = "ThreatTheme";
  private destroy$: Subject<void> = new Subject<void>();
  sequenceArray: any[]
  averageScoreUptoSelected: number = 0
  color: ScaleOrdinal<string, unknown>
  arrowColor: any = ""
  categorySummary: any[] = []
  view: [number, number] = [400, 400];
  legend: boolean = true;
  legendPosition: LegendPosition = LegendPosition.Below;
  assessmentAverageRating: string;
  categoryModulesOverAllRatings: CategoryModulesRating[] = []
  stackedBarChartHeightMultiplier: number = 22.5;
  moduleCardHeightOffset: number = 55;
  moduleChartHeightOffset: number = 20;


  stackedBarChartColorSchemes: StackedBarChartColorScheme[][] = [
    [
      {name: this.currentRatingTitle, value: '#634F7D'},
      {name: this.targetRatingTitle, value: '#B9B2CE'},],
    [
      {name: this.currentRatingTitle, value: '#F15F79'},
      {name: this.targetRatingTitle, value: '#F0ADBA'},],
    [
      {name: this.currentRatingTitle, value: '#6B9F78'},
      {name: this.targetRatingTitle, value: '#A8CCB1'},],
    [
      {name: this.currentRatingTitle, value: '#CC850A'},
      {name: this.targetRatingTitle, value: '#DEBD91'},],
    [
      {name: this.currentRatingTitle, value: '#003D4F'},
      {name: this.targetRatingTitle, value: '#A5B8BE'},],
    [
      {name: this.currentRatingTitle, value: '#47A1AD'},
      {name: this.targetRatingTitle, value: '#BBD6DD'},],
    [
      {name: this.currentRatingTitle, value: '#9A2D40'},
      {name: this.targetRatingTitle, value: '#F15F79'},],
    [
      {name: this.currentRatingTitle, value: '#1D3650'},
      {name: this.targetRatingTitle, value: '#003D4F'},],
    [
      {name: this.currentRatingTitle, value: '#7A4F06'},
      {name: this.targetRatingTitle, value: '#BE873E'},],
    [
      {name: this.currentRatingTitle, value: '#3E6044'},
      {name: this.targetRatingTitle, value: '#6B9F78'},],
    [
      {name: this.currentRatingTitle, value: '#005E7A'},
      {name: this.targetRatingTitle, value: '#5D9EAA'},],

  ];
  stackedBarChartXAxisLabels = [1, 2, 3, 4, 5];

  colorList: ColorScheme[] = [{value: d3.interpolateRainbow, viewValue: 'Rainbow Theme', textColor: 'white'},
    {value: d3.interpolateReds, viewValue: 'All Red', textColor: 'white'},
    {value: d3.interpolateRdPu, viewValue: 'Purple Red', textColor: 'white'},
    {value: d3.interpolatePurples, viewValue: 'All Purple', textColor: 'white'},
    {value: d3.interpolateWarm, viewValue: 'Warm Theme', textColor: 'black'},
    {value: d3.interpolateBlues, viewValue: 'All Blue', textColor: 'white'},
    {value: d3.interpolateSpectral, viewValue: 'Spectral Colors', textColor: 'white'},
    {value: "ThreatTheme", viewValue: 'Show Threats', textColor: 'white'}
  ];

  constructor(private appService: AppServiceService, private route: ActivatedRoute, @Optional() private store: Store<AppStates>) {
    this.assessmentData = this.store.select((storeMap) => storeMap.assessmentState.assessments)
  }

  ngOnInit() {
    this.assessmentData.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data !== undefined) {
        this.assessmentDescription = data.assessmentDescription
      }
    })
    const assessmentIdParam = this.route.snapshot.paramMap.get('assessmentId') || 0;
    this.assessmentId = +assessmentIdParam;
    this.store.dispatch(fromActions.getAssessmentId({id: this.assessmentId}))
    this.getSummaryData();
    this.getDataAndSunBurstChart();
  }


  getSummaryData() {
    this.appService.getSummaryData(this.assessmentId).pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.summaryData = data;
    })

  }

  getDataAndSunBurstChart() {
    this.appService.getReportData(this.assessmentId).pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.data = data;
      this.setCategorySummary(this.data);
      this.setModulesOverAllRatingsData(this.data);
      if (this.categorySummary.length > 0)
        this.drawSunBurstChart(this.data);
    })
  }

  drawSunBurstChart(data: ReportDataStructure) {
    let partition = (data: any) => {
      const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a: any, b: any) => b.value - a.value);
      return d3.partition()
        .size([2 * Math.PI, root.height + 1])
        (root);
    }

    this.arrowColor = "orange"

    let width = 800;
    let breadCrumbId = document.getElementById("sequence")
    this.initializeBreadcrumbTrail(breadCrumbId)

    let radius = 84

    let arc = d3.arc()
      .startAngle((d: any) => {
        return d.x0
      })
      .endAngle((d: any) => d.x1)
      .padAngle((d: any) => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius * 1.5)
      .innerRadius((d: any) => d.y0 * radius)
      .outerRadius((d: any) => Math.max(d.y0 * radius, d.y1 * radius - 1))


    const root = partition(this.data);

    root.each((d: any) => d.current = d);
    const svg = d3.select("#chart")
      .attr("width", width)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr('viewBox', '0 0 ' + 580 + ' ' + 900)
      .style("font", "10px sans-serif")
      .classed("svg-content-responsive", true);


    const vis = svg.append("svg:g")
      .attr("id", "container")
      .attr("transform", `translate(290,480)`);

    d3.select("#container").on("mouseleave", this.onMouseleave);

    const path = vis.append("g")
      .selectAll("path")
      .data(root.descendants().slice(1))
      .enter().append("path")
      .attr("fill", this.fillThreatColorsInChart)
      .attr("fill-opacity", (d: any) => arcVisible(d.current) ? (((d.data.rating < 3 && d.data.rating > 0) || d.data.value < 3) ? 0.9 : 0.7) : 0)
      .attr("d", (d: any) => {
        return <any>arc(d.current);
      })
      .on("mouseover", this.OnMouseOver)

    path.filter((d: any) => d.children)
      .style("cursor", "pointer")
      .on("click", clicked);

    path.append("title")
      .text((d: any) => d.data.name)
      .style("font", "100px");


    const label = vis.append("g")
      .attr("id", "chartTextGroup")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
      .selectAll("text")
      .data(root.descendants().slice(1))
      .enter().append("text")
      .attr("x", 0)
      .attr("dy", "0.03px")
      .attr("fill-opacity", (d: any) => +labelVisible(d.current))
      .attr("transform", (d: any) => labelTransform(d.current))
      .text((d: any) => d.data.name)
      .style("font", "9px Inter")
      .attr("fill", "white")
      .call(this.wrap, 75, 0.0004, 0.23);


    vis.append("circle")
      .datum(root)
      .attr("r", radius)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("click", clicked)

    function clicked(_event: any, p: any) {
      d3.select("#chart").select("#container").select("circle").datum(p.parent || root);

      root.each((d: any) => d.target = {
        x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        y0: Math.max(0, d.y0 - p.depth),
        y1: Math.max(0, d.y1 - p.depth)
      });

      const t = d3.select("#chart").select("#container").transition().duration(750);
      path.transition(<any>t)
        .tween("data", (d: any) => {
          const i = d3.interpolate(d.current, d.target);
          return (t: any) => d.current = i(t);
        })
        .filter(function (d: any) {
          return +<any>this.getAttribute("fill-opacity") || <any>arcVisible(d.target);
        })
        .attr("pointer-events", (d: any) => arcVisible(d.target) ? "auto" : "none")
        .attrTween("d", (d: any) => () => <any>arc(d.current));

      label.filter(function (d: any) {
        return +<any>this.getAttribute("fill-opacity") || <any>labelVisible(d.target)
      }).transition(<any>t)
        .attr("fill-opacity", (d: any) => +labelVisible(d.target))
        .attrTween("transform", (d: any) => () => labelTransform(d.current));
    }

    function arcVisible(d: any) {
      return d.y1 <= 5 && d.y0 >= 1 && d.x1 > d.x0;
    }

    function labelVisible(d: any) {
      let maxLevel = 5;
      let minLevel = 1;
      let minDisplayArea = 0.04;
      return d.y1 <= maxLevel && d.y0 >= minLevel && (d.y1 - d.y0) * (d.x1 - d.x0) > minDisplayArea;
    }

    function labelTransform(d: any) {
      const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
      const y = (d.y0 + d.y1) / 2 * radius;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }

    return svg.node();

  }

  onMouseleave(_d: any) {
    d3.select("#sequence")
      .style("visibility", "hidden");
    d3.selectAll("path")
      .style("opacity", 1)
    this.sequenceArray = []
  }


  getAncestors(node: any) {
    var path = [];
    var current = node;
    while (current) {
      path.unshift(current);
      current = current.parent;
    }
    return path;
  }

  initializeBreadcrumbTrail(_id: any) {
    var trail = d3.select("#sequence")
      .append("svg")
      .attr("width", "100%")
      .attr("id", "trail")
      .attr("fill-opacity", 0.6);

    trail.append("svg:circle")
      .attr("id", "endlabel")
      .attr("class", "endlabel")
      .attr("fill", this.arrowColor)
      .style("filter", "drop-shadow(0px 3px 6px rgba(0,0,0,0.5))")
    trail.append("svg:text")
      .attr("id", "ratingText")


  }

  updateSelectedAverageScore = (percentageString: any) => {
    let textColor = this.colorList.find(color => color.value === this.selectedValue)?.textColor;
    if (textColor === undefined)
      textColor = "white"
    d3.select("#trail").select("#endlabel")
      .attr("r", 30)
      .attr("cx", 143)
      .attr("fill-opacity", 1)
      .attr("cy", 40)


    d3.select("#trail").select("#ratingText")
      .attr("x", 137)
      .attr("y", 45)
      .attr("fill", textColor)
      .attr("fill-opacity", 1)
      .style("font", "20px Inter")
      .text(parseInt(percentageString));

    d3.select("#trail")
      .style("visibility", "");


  }

  getDataName(d: any) {
    return d.data.name
  }

  wrap(content: any, width: number, lineHeight: number, adjustPadding: number) {

    content.each(function (this: any) {
      let text = d3.select(<any>this),
        wordList = text.text().split(/\s+/),
        word,
        line: any = [],
        lineNumber = 0,
        y = text.attr("y"),
        x = text.attr("x"),
        dy = parseFloat(text.attr("dy"));
      let wrappedWords = AssessmentSummaryComponent.modifyDisplayText(wordList);

      dy = dy - (adjustPadding)
      let tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em").attr("id", lineNumber);
      while (word = wrappedWords.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        dy = parseFloat(text.attr("dy"));
        let len = tspan.node()?.getComputedTextLength();
        if (<any>len > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", lineNumber++ * lineHeight + dy + 0.85 + "em").text(word);
        }
      }
    });
  }


  private static modifyDisplayText(wordList: string[]): string[] {
    let maximumDisplayWords = 3;
    if (wordList.length >= maximumDisplayWords) {
      wordList = wordList.slice(0, 2)
      wordList.push("...")
    }
    let wrappedWords = [];
    let maximumDisplayWordLength = 10;
    wrappedWords = wordList.map(eachWord => eachWord.length > maximumDisplayWordLength ? eachWord.substring(0, maximumDisplayWordLength) + "..." : eachWord)
    return wrappedWords.reverse();
  }

  onThemeChange() {
    let textColor = this.colorList.find(color => color.value === this.selectedValue)?.textColor;
    if (textColor === undefined)
      textColor = "white";
    d3.select("#chart").select("#container").selectAll("#chartTextGroup")
      .selectAll("text").attr("fill", textColor)

    if (this.selectedValue == "ThreatTheme") {
      this.arrowColor = "orange"
      d3.select("#trail").select("#endlabel")
        .attr("fill", this.arrowColor)
      d3.select("#chart").select("#container").selectAll("path")
        .attr("fill", this.fillThreatColorsInChart)

    } else {
      let color = d3.scaleOrdinal(d3.quantize(this.selectedValue, this.data.children.length + 11).reverse());
      this.color = color
      this.arrowColor = <string>this.color("1")

      d3.select("#trail").select("#endlabel")
        .attr("fill", this.arrowColor)

      d3.select("#chart").select("#container").selectAll("path")
        .attr("fill", (d: any) => {
          while (d.depth > 1) d = d.parent;
          return <string>this.color(d.data.name);
        })
    }
  }

  fillThreatColorsInChart(d: any) {
    if ((d.data.rating < 3 && d.data.rating > 0) || d.data.value < 3) {
      return "red"
    } else if (parseInt(d.data.rating) == 3 || parseInt(d.data.value) == 3) {
      return "orange"
    } else {
      return "green"
    }
  }

  fillRatingCircle(percentageString: any) {
    if (parseInt(percentageString) > 3) {
      return "green"
    } else if (parseInt(percentageString) == 3) {
      return "orange"
    } else {
      return "red"
    }
  }

  OnMouseOver = (_event: any, d: any) => {
    this.averageScoreUptoSelected = 0;
    if (!d.data.rating || d.data.value == 0) {
      this.averageScoreUptoSelected = d.data.value;
    } else {
      this.averageScoreUptoSelected = d.data.rating;
    }

    let sequenceArray = this.getAncestors(d);
    this.sequenceArray = this.getAncestors(d);
    this.updateSelectedAverageScore(this.averageScoreUptoSelected);
    d3.select("#chart").select("#container").selectAll("path")
      .style("opacity", 0.3);
    d3.select("#sequence")
      .style("visibility", "visible");
    d3.select("#chart").select("#container").selectAll("path")
      .filter(function (node: any) {
        return (sequenceArray.indexOf(node) >= 0);
      })
      .style("opacity", 1);
  }

  downloadImage() {
    html2canvas(this.screen.nativeElement).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = this.data.name + '-sunburst-chart.png';
      this.downloadLink.nativeElement.click();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setCategorySummary(data: ReportDataStructure) {
    data.children.forEach(eachCategory => {
      if (eachCategory.rating != 0) {
        this.categorySummary.push({name: eachCategory.name, value: eachCategory.rating})
      }
    })
    this.calculateAssessmentRating()
  }


  private calculateAssessmentRating() {
    let sum = 0
    this.categorySummary.forEach(eachCategory => {
      sum += eachCategory.value;
    })
    this.assessmentAverageRating = String((sum / this.categorySummary.length).toFixed(1))
  }

  private setModulesOverAllRatingsData(data: ReportDataStructure) {
    data.children.forEach(eachCategory => {
      if (eachCategory.rating != 0) {
        let modulesOverAllRatings: ModulesOverAllRating[] = []
        eachCategory.children?.forEach(eachModule => {
          if (eachModule.rating > 0) {
            let moduleRatings: ModuleRatingTypes[] = [
              {
                name: this.currentRatingTitle,
                value: Math.floor(eachModule.rating)
              }, {
                name: this.targetRatingTitle,
                value: 5 - Math.floor(eachModule.rating)
              },
            ]
            let modulesOverAllRating: ModulesOverAllRating = {
              name: eachModule.name, series: moduleRatings
            }
            modulesOverAllRatings.push(modulesOverAllRating);
          }
        })
        let categoryModulesRating: CategoryModulesRating = {
          categoryName: eachCategory.name, modulesOverAllRatings: modulesOverAllRatings
        }
        this.categoryModulesOverAllRatings.push(categoryModulesRating);
      }
    })

  }
}
