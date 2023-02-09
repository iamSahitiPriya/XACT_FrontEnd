import {Component, Input, OnInit} from '@angular/core';
import {ReportDataStructure} from "../../../types/ReportDataStructure";
import {ChartConfiguration, ChartData, ChartType} from 'chart.js';

interface RadarChartProperty {
  data: number[],
  fill: boolean,
  label: string,
  borderColor: string,
  borderWidth: number,
  backgroundColor: string
}

interface RadarChartModuleData {
  moduleName: string,
  data: ChartData<'radar'>
}

interface RadarChartData {
  categoryName: string,
  data: RadarChartModuleData[]
}

@Component({
  selector: 'app-assessment-radar-chart',
  templateUrl: './assessment-radar-chart.component.html',
  styleUrls: ['./assessment-radar-chart.component.css']
})
export class AssessmentRadarChartComponent implements OnInit {
  radarChartData: RadarChartData[] = [];
  public radarChartType: ChartType = 'radar';
  public radarChartConfiguration: ChartConfiguration['options'] = {
    plugins: {
      tooltip: {
        displayColors:false,
        callbacks: {
          title: (context) => {
            return context[0].label
          }
        },
      }
    },
    elements: {
      line: {
        tension: 0.1,
      },
      point: {
        radius: 2,
      },
    },
    scales: {
      r: {
        ticks: {
          stepSize: 1
        },
        pointLabels:{
          callback:(label,index) =>{
            return label.length > 15 ? label.substring(0, 15) + "..." : label
          }
        },
        grid: {
          circular: true,
        },
        min: 0, max: 5
      }
    },
    responsive: true,
  };

  @Input()
  summaryData: ReportDataStructure

  constructor() {
  }

  ngOnInit(): void {
    this.formatDataForRadarChart()
  }

  private formatDataForRadarChart() {
    this.summaryData.children.forEach(eachCategory => {
        if (eachCategory.rating !== 0) {
          let radarChartData: RadarChartData = {categoryName: eachCategory.name, data: []}
          eachCategory?.children?.forEach(eachModule => {
            if (eachModule.rating !== 0) {
              let radarChartModuleData: RadarChartModuleData = {
                moduleName: eachModule.name,
                data: {labels: [], datasets: []}
              }
              let currentData: RadarChartProperty = {
                backgroundColor: 'red',
                data: [],
                fill: false,
                label: "Current Score",
                borderColor: 'red',
                borderWidth: 1
              }
              let targetData: RadarChartProperty = {
                backgroundColor: 'green',
                data: [],
                fill: false,
                label: "Target Score",
                borderColor: 'green',
                borderWidth: 1
              }
              eachModule?.children?.forEach(eachTopic => {
                radarChartModuleData.data.labels?.push(eachTopic.name)
                if (eachTopic.rating !== undefined) {
                  currentData.data.push(eachTopic.value ? eachTopic.value : eachTopic.rating)
                  targetData.data.push(5)
                }
              })
              radarChartModuleData.data.datasets.push(currentData)
              radarChartModuleData.data.datasets.push(targetData)
              radarChartData.data.push(radarChartModuleData)
            }
          })
          this.radarChartData.push(radarChartData);
        }
      }
    )
  }

}
