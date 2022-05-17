import {Component, Input} from '@angular/core';
import {TopicStructure} from "../../types/topicStructure";

@Component({
  selector: 'app-parameter-level-assessment',
  templateUrl: './parameter-level-assessment.component.html',
  styleUrls: ['./parameter-level-assessment.component.css']
})
export class ParameterLevelAssessmentComponent {

  @Input()
  topicInput: TopicStructure;

}
