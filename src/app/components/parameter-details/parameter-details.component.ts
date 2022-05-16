import {Component, Input} from '@angular/core';
import {AssessmentStructure} from "../../types/assessmentStructure";
import {CategoryStructure} from "../../types/categoryStructure";
import {TopicStructure} from "../../types/topicStructure";
import {ParameterStructure} from "../../types/parameterStructure";
import {AppServiceService} from "../../services/app-service/app-service.service";


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
