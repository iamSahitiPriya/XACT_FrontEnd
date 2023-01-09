/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as d3 from 'd3';
import {ScaleOrdinal} from 'd3';
import {AppServiceService} from "../../services/app-service/app-service.service";
import {ActivatedRoute} from "@angular/router";
import * as fromActions from "../../actions/assessment-data.actions";
import {Store} from "@ngrx/store";
import {AssessmentState} from "../../reducers/app.states";
import {ReportDataStructure} from "../../types/ReportDataStructure";
import {data_local} from "../../messages";
import {Subject, takeUntil} from "rxjs";
import html2canvas from "html2canvas";
import {SummaryResponse} from "../../types/summaryResponse";


interface ColorScheme {
  value?: any,
  viewValue: string
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

  pageTitle = data_local.SUMMARY_REPORT.TITLE;
  downloadActionTooltip = data_local.SUMMARY_REPORT.DOWNLOAD_ACTION_TOOLTIP;
  goBackToDashboard = data_local.ASSESSMENT_MENU.GO_BACK;
  instructionPanel = data_local.SUMMARY_REPORT.INSTRUCTION
  moduleAssessed = data_local.SUMMARY_REPORT.MODULE_ASSESSED;
  categoryAssessed = data_local.SUMMARY_REPORT.CATEGORY_ASSESSED;
  topicAssessed = data_local.SUMMARY_REPORT.TOPIC_ASSESSED;
  parameterAssessed = data_local.SUMMARY_REPORT.PARAMETER_ASSESSED;
  questionAssessed = data_local.SUMMARY_REPORT.QUESTION_ASSESSED;
  assessmentId: number;
  data: ReportDataStructure;
  summaryData: SummaryResponse;
  selectedValue: any = d3.interpolateSpectral;
  private destroy$: Subject<void> = new Subject<void>();
  sequenceArray: any[]
  averageScoreUptoSelected: number = 0
  color:ScaleOrdinal<string, unknown>
  arrowColor:any = ""


  colorList: ColorScheme[] = [{value: d3.interpolateRainbow, viewValue: 'Rainbow Theme'},
    {value: d3.interpolateReds, viewValue: 'All Red'},
    {value: d3.interpolateRdPu, viewValue: 'Purple Red'},
    {value: d3.interpolatePurples, viewValue: 'All Purple'},
    {value: d3.interpolateWarm, viewValue: 'Warm Theme'},
    {value: d3.interpolateBlues, viewValue: 'All Blue'},
    {value: d3.interpolateSpectral, viewValue: 'Spectral Colors'},
    {value: "ThreatTheme", viewValue: 'Show Threats'}
  ];

  ngOnInit() {
    const assessmentIdParam = this.route.snapshot.paramMap.get('assessmentId') || 0;
    this.assessmentId = +assessmentIdParam;
    this.store.dispatch(fromActions.getAssessmentId({id: this.assessmentId}))
    this.getSummaryData();
    this.getDataAndSunBurstChart();
  }

  constructor(private appService: AppServiceService, private route: ActivatedRoute, private store: Store<AssessmentState>) {

  }

  getSummaryData(){
    this.appService.getSummaryData(this.assessmentId).pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.summaryData = data;
    })

  }

  getDataAndSunBurstChart() {
    this.appService.getReportData(this.assessmentId).pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.data = data;
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

    let color = d3.scaleOrdinal(d3.quantize(this.selectedValue, data.children.length + 11).reverse());
    this.color = color
    this.arrowColor = <string>this.color("1")

    let width = 800;
    let breadCrumbId = document.getElementById("sequence")
    this.initializeBreadcrumbTrail(breadCrumbId)

    let radius = width / 10.5

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
      .attr('viewBox', '0 0 ' + 580 + ' ' + 850)
      .style("font", "10px sans-serif")
      .classed("svg-content-responsive", true);


    const vis = svg.append("svg:g")
      .attr("id", "container")
      .attr("transform", `translate(290,425)`);

    d3.select("#container").on("mouseleave", this.onMouseleave);


    const path = vis.append("g")
      .selectAll("path")
      .data(root.descendants().slice(1))
      .enter().append("path")
      .attr("fill", (d: any) => {
        while (d.depth > 1) d = d.parent;
        return <string>this.color(d.data.name);
      })
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
      .style("font", "21px");


    const label = vis.append("g")
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
      .style("font", "7px Inter")
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
      return d.y1 <= 5 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.07;
    }

    function labelTransform(d: any) {
      const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
      const y = (d.y0 + d.y1) / 2 * radius;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }

    return svg.node();

  }

  onMouseleave(_d: any) {
    // d3.select("#sequence")
    //   .style("visibility", "hidden");
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

    var defs = trail.append("defs")
    var gradient = defs.append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");

    gradient
      .append("stop")
      .attr("offset", "55%")
      .attr("stop-color",<string>this.color("1"))

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "white")



    trail.append("svg:circle")
      .attr("id", "endlabel")
      .attr("class","endlabel")
      .attr("fill", "url(#gradient)")
      .style("filter", "drop-shadow(0px 3px 6px rgba(0,0,0,0.5))")
    trail.append("svg:text")
      .attr("id", "ratingText")

  }

  updateSelectedAverageScore = (percentageString: any) => {
    d3.select("#trail").select("#endlabel")
      .attr("r", 30)
      .attr("cx", 140)
      .attr("fill-opacity", 1)
      .attr("cy", 30)


    d3.select("#trail").select("#ratingText")
      .attr("x", 135)
      .attr("y", 36)
      .attr("fill", "white")
      .attr("fill-opacity", 1)
      .style("font", "20px Inter")
      .text(parseInt(percentageString));

    d3.select("#trail")
      .style("visibility", "");
    d3.selectAll("#downArrow")
      .style("color",this.arrowColor)

  }

  getDataName(d: any) {
    return d.data.name
  }

  wrap(content: any, width: any, lineHeight: any, adjustPadding: any) {

    content.each(function (this: any) {
      var text = d3.select(<any>this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line: any = [],
        lineNumber = 0,
        y = text.attr("y"),
        x = text.attr("x"),
        dy = parseFloat(text.attr("dy")),
        dyAdjust = 0;
      if (words.length > 3) {
        dyAdjust = words.length / 1.95;
      }
      dy = dy - (adjustPadding * dyAdjust)
      let tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em").attr("id", lineNumber);

      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        dy = parseFloat(text.attr("dy"));
        var len = tspan.node()?.getComputedTextLength();
        if (<any>len > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", lineNumber++ * lineHeight + dy + 0.85 + "em").text(word);
        }
      }


    });
  }


  onThemeChange() {
    if (this.selectedValue == "ThreatTheme") {
      this.arrowColor = "orange"
      d3.select("#gradient").select("stop")
        .attr("stop-color", "orange")
      d3.selectAll("#downArrow")
        .style("color","orange")

      d3.selectAll("path")
        .attr("fill", this.fillThreatColorsInChart)
    } else {
      let color = d3.scaleOrdinal(d3.quantize(this.selectedValue, this.data.children.length + 11).reverse());
      this.color = color
      this.arrowColor = <string>this.color("1")
      let breadCrumbColor = <string>this.color("1")
      d3.select("#gradient").select("stop")
        .attr("stop-color", breadCrumbColor);
      d3.select("#trail").select("#endlabel")
        .attr("fill", "url(#gradient)")
      d3.selectAll("#downArrow")
        .style("color",breadCrumbColor)
      d3.selectAll("path")
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
    d3.select("#downArrow-span").selectAll("#downArrow")
      .style("color",this.arrowColor)
    this.updateSelectedAverageScore(this.averageScoreUptoSelected);
    d3.selectAll("path")
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

}
