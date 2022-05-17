import {Component, Input} from '@angular/core';
import {ParameterStructure} from "../../types/parameterStructure";

@Component({
  selector: 'app-assessment-question',
  templateUrl: './assessment-question.component.html',
  styleUrls: ['./assessment-question.component.css']
})
export class AssessmentQuestionComponent  {

  @Input()
  parameterDetails: ParameterStructure;
  @Input()
  initial: number

}
