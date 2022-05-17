import {Component, Input} from '@angular/core';
import {TopicStructure} from "../../types/topicStructure";
import {ParameterStructure} from "../../types/parameterStructure";


@Component({
  selector: 'app-topic-details-screen',
  templateUrl: './parameter-details.component.html',
  styleUrls: ['./parameter-details.component.css']
})
export class ParameterDetailsComponent {
  parameter: ParameterStructure
  parameters: ParameterStructure[];

  @Input()
  topicInput: TopicStructure;

}
