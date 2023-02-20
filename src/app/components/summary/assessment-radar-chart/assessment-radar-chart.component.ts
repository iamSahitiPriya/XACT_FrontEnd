/*
 *  Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Input, OnInit} from '@angular/core';
import {ReportDataStructure} from "../../../types/ReportDataStructure";
import {ChartConfiguration, ChartData, ChartType} from 'chart.js';
import {data_local} from "../../../messages";

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
  currentDataColor: string = '#F15F79';
  targetDataColor: string = '#6D9D79';
  targetScoreLabel: string = data_local.RADAR_CHART.TARGET_SCORE_LABEL;
  currentScoreLabel: string = data_local.RADAR_CHART.CURRENT_SCORE_LABEL;
  chartTitle: string = data_local.RADAR_CHART.CHART_TITLE;
  public radarChartType: ChartType = 'radar';
  public radarChartConfiguration: ChartConfiguration['options'] = {
    plugins: {
      tooltip: {
        displayColors: false,
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
        pointLabels: {
          callback: (label) => {
            return this.getFormattedLabel(label)
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
  private chartBorderWidth: number = 1;
  private targetScore: number = 5;
  private isAreaFilled: boolean = false;

  public getFormattedLabel(label: string) {
    let maxDisplayWordLength = 15;
    return label.length > maxDisplayWordLength ? label.substring(0, maxDisplayWordLength) + "..." : label;
  }

  @Input()
  summaryData: ReportDataStructure


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
                backgroundColor: this.currentDataColor,
                data: [],
                fill: this.isAreaFilled,
                label: this.currentScoreLabel,
                borderColor: this.currentDataColor,
                borderWidth: this.chartBorderWidth
              }
              let targetData: RadarChartProperty = {
                backgroundColor: this.targetDataColor,
                data: [],
                fill: this.isAreaFilled,
                label: this.targetScoreLabel,
                borderColor: this.targetDataColor,
                borderWidth: this.chartBorderWidth
              }
              eachModule?.children?.forEach(eachTopic => {
                radarChartModuleData.data.labels?.push(eachTopic.name)
                if (eachTopic.rating !== undefined) {
                  currentData.data.push(eachTopic.value ? eachTopic.value : eachTopic.rating)
                  targetData.data.push(this.targetScore)
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
