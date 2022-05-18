import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TopicStructure} from "../../types/topicStructure";

@Component({
  selector: 'app-topic-level-assessment',
  templateUrl: './topic-level-assessment.component.html',
  styleUrls: ['./topic-level-assessment.component.css']
})
export class TopicLevelAssessmentComponent {
  @Input() selectedIndex:number
  @Output() goNext= new EventEmitter<number>();
  @Output() goBack= new EventEmitter<number>();

  @Input()
  topicInput: TopicStructure;
  next(){
    console.log(this.selectedIndex)
    this.selectedIndex+=1
    this.goNext.emit(this.selectedIndex)
  }

  previous() {
    if(this.selectedIndex!=0) {
      this.selectedIndex -= 1
      this.goBack.emit(this.selectedIndex)
    }

  }
}
