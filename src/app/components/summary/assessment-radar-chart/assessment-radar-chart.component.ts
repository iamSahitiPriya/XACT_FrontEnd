import {Component, Input, OnInit} from '@angular/core';
import {ReportDataStructure} from "../../../types/ReportDataStructure";
import {ChartConfiguration, ChartData, ChartType} from 'chart.js';
import {
  getInteractiveElementAXObjectSchemas
} from "@angular-eslint/eslint-plugin-template/dist/eslint-plugin-template/src/utils/is-interactive-element/get-interactive-element-ax-object-schemas";

interface RadarDataset {
  data: number[],
  fill: boolean,
  label: string,
  borderColor: string,
  borderWidth: number
}

interface RadarChart {
  labels: string[],
  datasets: RadarDataset[]
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
  public radarChartOptions: ChartConfiguration['options']= {
    elements: {
      line: {
        tension: 0.1
      }
    },
    scales: {
      r: {
        ticks: {
          stepSize: 1
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
              let dataset: RadarDataset = {
                data: [],
                fill: false,
                label: "Current Score",
                borderColor: "#387AC4",
                borderWidth: 1
              }
              let targetDataset: RadarDataset = {
                data: [],
                fill: false,
                label: "Target Score",
                borderColor: "#1D3650",
                borderWidth: 1
              }
              eachModule?.children?.forEach(eachTopic => {
                radarChartModuleData.data.labels?.push(eachTopic.name)
                this.modifyTopicName(eachTopic.name)
                if (eachTopic.rating !== undefined) {
                  dataset.data.push(eachTopic.value ? eachTopic.value : eachTopic.rating)
                  targetDataset.data.push(5)
                }
              })
              radarChartModuleData.data.datasets.push(dataset)
              radarChartModuleData.data.datasets.push(targetDataset)
              radarChartData.data.push(radarChartModuleData)
            }
          })
          this.radarChartData.push(radarChartData);
        }
      }
    )
  }

  modifyTopicName(name: string){
   let  wordList = name.split(/\s+/);
    if(wordList.length > 3){
      wordList = wordList.slice(0, 2)
      wordList.push("...")
    }
    }
  private static modifyDisplayText(wordList: string[]) : string[] {
    let maximumDisplayWords = 3;
    if (wordList.length >= maximumDisplayWords) {
      wordList = wordList.slice(0, 2)
      wordList.push("...")
    }
    let wrappedWords = [];
    let maximumDisplayWordLength=10;
    wrappedWords=wordList.map(eachWord => eachWord.length > maximumDisplayWordLength ? eachWord.substring(0,maximumDisplayWordLength)+ "..."  : eachWord)
    return wrappedWords.reverse();
  }
}
