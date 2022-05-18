import {Component, Input} from '@angular/core';
import {TopicStructure} from "../../types/topicStructure";

@Component({
  selector: 'app-topic-level-assessment',
  templateUrl: './topic-level-assessment.component.html',
  styleUrls: ['./topic-level-assessment.component.css']
})
export class TopicLevelAssessmentComponent {


  @Input()
  topicInput: TopicStructure;

}
