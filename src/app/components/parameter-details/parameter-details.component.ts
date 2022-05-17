import {Component, Input} from '@angular/core';
import {TopicStructure} from "../../types/topicStructure";


@Component({
  selector: 'app-topic-details-screen',
  templateUrl: './parameter-details.component.html',
  styleUrls: ['./parameter-details.component.css']
})
export class ParameterDetailsComponent {
  @Input()
  topicInput: TopicStructure;

}
