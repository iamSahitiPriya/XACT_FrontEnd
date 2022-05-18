import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TopicStructure} from "../../types/topicStructure";

@Component({
  selector: 'app-parameter-level-assessment',
  templateUrl: './parameter-level-assessment.component.html',
  styleUrls: ['./parameter-level-assessment.component.css']
})
export class ParameterLevelAssessmentComponent {
  constructor() {}

  @Input() selectedIndex:number
  @Output() goNext= new EventEmitter<number>();
  @Output() goBack= new EventEmitter<number>();
  @Input()
  topicInput: TopicStructure;

  next(){
    this.selectedIndex+=1
    this.goNext.emit(this.selectedIndex)
  }

  previous() {
    if(this.selectedIndex!=0) {
      this.selectedIndex -= 1
      this.goBack.emit(this.selectedIndex)
    }

  }

  cancel(textArea: string) {
    // this.dialog.open()textArea = ""
  }

}
