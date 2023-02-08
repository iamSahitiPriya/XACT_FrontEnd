import {Component, Input, OnInit} from '@angular/core';
import {ReportDataStructure} from "../../../types/ReportDataStructure";
import {ChartConfiguration, ChartData, ChartType} from 'chart.js';

interface RadarDataset {
  data: number[],
  fill: boolean,
  label: string,
  borderColor:string,
  borderWidth:number
}

interface RadarChart {
  labels: string[],
  datasets: RadarDataset[]
}

interface RadarChartData {
  moduleName: string,
  data: ChartData<'radar'>
}

@Component({
  selector: 'app-assessment-radar-chart',
  templateUrl: './assessment-radar-chart.component.html',
  styleUrls: ['./assessment-radar-chart.component.css']
})
export class AssessmentRadarChartComponent implements OnInit {
  data: RadarChartData[] = []
  public radarChartType: ChartType = 'radar';
  public radarChartOptions: any = {
    elements: {
      line: {
        tension: 0.1
      }
    },
    scales: {
      r: {
        grid: {
          circular: true,
        },
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
          eachCategory?.children?.forEach(eachModule => {
            if (eachModule.rating !== 0) {
              let radarChartData: RadarChartData = {moduleName: eachModule.name, data: {labels: [], datasets: []}}
              let dataset: RadarDataset = {data: [], fill: false, label: "Current Score", borderColor:"#387AC4",borderWidth:1}
              let targetDataset: RadarDataset = {data: [], fill: false, label: "Target Score", borderColor:"#1D3650",borderWidth:1}
              eachModule?.children?.forEach(eachTopic => {
                radarChartData.data.labels?.push(eachTopic.name)
                if (eachTopic.rating !== undefined) {
                  dataset.data.push(eachTopic.value ? eachTopic.value : eachTopic.rating)
                  targetDataset.data.push(5)
                }
              })
              radarChartData.data.datasets.push(dataset)
              radarChartData.data.datasets.push(targetDataset)
              this.data.push(radarChartData)
            }
          })
        }
      }
    )
    console.log(this.data)
  }
}
