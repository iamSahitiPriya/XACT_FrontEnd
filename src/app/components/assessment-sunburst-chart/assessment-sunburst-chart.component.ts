/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as d3 from 'd3';
import {AppServiceService} from "../../services/app-service/app-service.service";
import {ActivatedRoute} from "@angular/router";
import * as fromActions from "../../actions/assessment-data.actions";
import {Store} from "@ngrx/store";
import {AssessmentState} from "../../reducers/app.states";
import {ReportDataStructure} from "../../types/ReportDataStructure";
import {data_local} from "../../messages";
import {Subject, takeUntil} from "rxjs";
import html2canvas from "html2canvas";


interface ColorScheme {
  value?: any,
  viewValue: string
}

@Component({
  selector: 'app-assessment-sunburst-chart',
  templateUrl: './assessment-sunburst-chart.component.html',
  styleUrls: ['./assessment-sunburst-chart.component.css']
})



export class AssessmentSunburstChartComponent implements OnInit,OnDestroy {

  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;

  pageTitle = data_local.SUMMARY_REPORT.TITLE;
  downloadActionTooltip = data_local.SUMMARY_REPORT.DOWNLOAD_ACTION_TOOLTIP;
  goBackToDashboard = data_local.ASSESSMENT_MENU.GO_BACK_DASHBOARD;
  assessmentId: number;
  data: ReportDataStructure;
  selectedValue: any = d3.interpolateSpectral;
  private destroy$: Subject<void> = new Subject<void>();


  colorList: ColorScheme[] = [{value: d3.interpolateRainbow, viewValue: 'Rainbow Theme'},
    {value: d3.interpolateReds, viewValue: 'All Red'},
    {value: d3.interpolateRdPu, viewValue: 'Purple Red'},
    {value: d3.interpolatePurples, viewValue: 'All Purple'},
    {value: d3.interpolateWarm, viewValue: 'Warm Theme'},
    {value: d3.interpolateBlues, viewValue: 'All Blue'},
    {value: d3.interpolateSpectral, viewValue: 'Spectral Colors'},
    {value:"ThreatTheme",viewValue: 'Show Threats'}
  ];

  ngOnInit() {
    const assessmentIdParam = this.route.snapshot.paramMap.get('assessmentId') || 0;
    this.assessmentId = +assessmentIdParam;
    this.store.dispatch(fromActions.getAssessmentId({id: this.assessmentId}))
    this.getDataAndSunBurstChart();
  }

  constructor(private appService: AppServiceService, private route: ActivatedRoute, private store: Store<AssessmentState>) {

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

    let width = 800;
    let breadCrumbId = document.getElementById("sequence")
    this.initializeBreadcrumbTrail(breadCrumbId, color)

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
        return <string>color(d.data.name);
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
      .call(this.wrap, 75,0.0004, 0.23);



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
    d3.select("#trail")
      .style("visibility", "hidden");
    d3.selectAll("path")
      .style("opacity", 1)
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

  initializeBreadcrumbTrail(_id: any, color: any) {
    var trail = d3.select("#sequence")
      .append("svg")
      .attr("width", "100%")
      .attr("height", 850)
      .attr("id", "trail")
      .attr("fill", <string>color("1"))
      .attr("fill-opacity", 0.6);

    trail.append("svg:circle")
      .attr("id", "endlabel")
    trail.append("svg:text")
      .attr("id", "ratingText")
  }

  breadcrumbFigure(_d: any, i: any) {
    let breadCrumbPoints = {
      s: 20, t: 10, d: 105, w: 310, h: 80
    };
    var points = [];
    points.push("0,0");
    if (i > 0) {
      points.push((breadCrumbPoints.w / 2) + "," + breadCrumbPoints.h / 3);
    }
    points.push(breadCrumbPoints.w + ",0");
    points.push(breadCrumbPoints.w + "," + breadCrumbPoints.h);
    points.push(breadCrumbPoints.w / 2 + "," + (<number>breadCrumbPoints.h + 40));
    points.push("0," + breadCrumbPoints.h);

    return points.join(" ");
  }

  updateBreadcrumbs = (nodeArray: any, percentageString: any) => {
    let breadCrumbPoints = {
      s: 30, t: 10, d: 105, w: 310, h: 80
    };
    var g = d3.select("#trail")
      .selectAll("g")
      .data(nodeArray, function (d: any) {
        return d.data.name + d.depth;
      })

    var entering = g.enter().append("svg:g")
      .attr("transform", this.getBreadCrumbTranslation)

    entering.append("polygon")
      .attr("points", this.breadcrumbFigure)

    entering.
    append("svg:text")
      .attr("x", (breadCrumbPoints.w + breadCrumbPoints.t) / 2)
      .attr("y", breadCrumbPoints.h / 1.7)
      .attr("dy", "0.98em")
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .attr("fill-opacity", 1)
      .text(this.getDataName)
      .style("font", "15px Inter")
      .call(this.wrap, 300,0.8,0);

    g.exit().remove();


    d3.select("#trail").select("#endlabel")
      .attr("r", 30)
      .attr("fill", this.fillRatingCircle(percentageString))
      .attr("cx", (breadCrumbPoints.w / 2) + 5)
      .attr("fill-opacity", 1)
      .attr("cy", (nodeArray.length + 0.4) * (breadCrumbPoints.h + breadCrumbPoints.s))


    d3.select("#trail").select("#ratingText")
      .attr("x", (breadCrumbPoints.w / 2))
      .attr("y", (nodeArray.length + 0.45) * (breadCrumbPoints.h + breadCrumbPoints.s))
      .attr("fill", "white")
      .attr("fill-opacity", 1)
      .style("font", "20px Inter")
      .text(parseInt(percentageString));

    d3.select("#trail")
      .style("visibility", "");

  }

  getDataName(d: any) {
    return d.data.name
  }

  getBreadCrumbTranslation(d: any) {
    let breadCrumbPoints = {
      s: 20, t: 10, d: 105, w: 310, h: 80
    };
    return "translate(" + 0 + "," + d.depth * (breadCrumbPoints.d) + ")";
  }

  wrap(content: any, width: any,lineHeight:any, adjustPadding:any) {

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
      if(words.length>3) {
        dyAdjust = words.length / 1.95;
      }
      dy = dy - (adjustPadding * dyAdjust)
      let tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em").attr("id",lineNumber);

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


  onThemeChange(val: any) {
    this.selectedValue = val
    if (this.selectedValue == "ThreatTheme") {
      d3.select("#trail")
        .attr("fill", "orange")

      d3.selectAll("path")
        .attr("fill", this.fillThreatColorsInChart)
    } else {
      let color = d3.scaleOrdinal(d3.quantize(this.selectedValue, this.data.children.length + 11).reverse());
      let breadCrumbColor = <string>color("1")
      d3.select("#trail")
        .attr("fill", breadCrumbColor)
      d3.selectAll("path")
        .attr("fill", (d: any) => {
          while (d.depth > 1) d = d.parent;
          return <string>color(d.data.name);
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
    let percentageText = 0;
    if (!d.data.rating || d.data.value == 0) {
      percentageText = d.data.value;
    } else {
      percentageText = d.data.rating;
    }
    var sequenceArray = this.getAncestors(d);
    this.updateBreadcrumbs(sequenceArray, percentageText);
    d3.selectAll("path")
      .style("opacity", 0.3);

    d3.select("#chart").select("#container").selectAll("path")
      .filter(function (node: any) {
        return (sequenceArray.indexOf(node) >= 0);
      })
      .style("opacity", 1);
  }

  downloadImage(){
    html2canvas(this.screen.nativeElement).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = this.data.name+'-sunburst-chart.png';
      this.downloadLink.nativeElement.click();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
