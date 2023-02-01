import { Component } from '@angular/core';

@Component({
  selector: 'app-roadmap-bubble-chart',
  templateUrl: './roadmap-bubble-chart.component.html',
  styleUrls: ['./roadmap-bubble-chart.component.css']
})
export class RoadmapBubbleChartComponent  {

  constructor() { }

  multi = [
    {
      name: "Bags",
      series: [
        {
          name: 2000,
          x: 2.2,
          y: 2.3,
          r: 55
        },
        //     {
        //       name: 2001,
        //       x: new Date(2001, 0, 1),
        //       y: 30.3,
        //       r: 68
        //     },
        //     {
        //       name: 2002,
        //       x: new Date(2002, 0, 1),
        //       y: 72,
        //       r: 80
        //     },
        //     {
        //       name: 2003,
        //       x: new Date(2003, 0, 1),
        //       y: 62,
        //       r: 80
        //     }
        //   ]
        // },
        // {
        //   name: "NDB",
        //   series: [
        //     {
        //       name: 2000,
        //       x: new Date(2000, 0, 1),
        //       y: 50.3,
        //       r: 50
        //     },
        //     {
        //       name: 2001,
        //       x: new Date(2001, 0, 1),
        //       y: 70.3,
        //       r: 48
        //     },
        //     {
        //       name: 2002,
        //       x: new Date(2002, 0, 1),
        //       y: 22,
        //       r: 80
        //     },
        //     {
        //       name: 2003,
        //       x: new Date(2003, 0, 1),
        //       y: 42,
        //       r: 80
        //     }
      ]
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
  xAxisTicks = [0,1,2,3];
  yAxisTicks = [0,1,2,3];

  xAxisTickFormatting(value : any):any {
    if(value > 0 && value <= 1)
      return "NOW";
    else if(value > 1 && value <= 2)
      return "NEXT";
    else if(value > 2 && value <= 3)
      return "LATER";
    else
      return " ";
  }

  yAxisTickFormatting(value : any):any {
    if(value > 0 && value <= 1)
      return "LOW";
    else if(value > 1 && value <= 2)
      return "MEDIUM";
    else if(value > 2 && value <= 3)
      return "HIGH";
    else
      return  " ";
  }

}
