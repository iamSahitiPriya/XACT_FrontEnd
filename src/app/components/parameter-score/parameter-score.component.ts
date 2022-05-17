import {Component, Input} from '@angular/core';
import {ParameterReference} from "../../types/parameterReference";

@Component({
  selector: 'app-parameter-score',
  templateUrl: './parameter-score.component.html',
  styleUrls: ['./parameter-score.component.css']
})
export class ParameterScoreComponent {
  @Input()
  parameterScore: ParameterReference[];
}
