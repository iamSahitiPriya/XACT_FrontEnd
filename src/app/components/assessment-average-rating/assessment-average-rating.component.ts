import {Component, Input, OnInit} from '@angular/core';
import {TopicRatingResponse} from "../../types/topicRatingResponse";
import {Observable} from "rxjs";
import {ComputedScore} from "../../reducers/app.states";
import * as fromReducer from "../../reducers/assessment.reducer";
import {Store} from "@ngrx/store";
import {data_local} from "../../../assets/messages";


@Component({
  selector: 'app-assessment-average-rating',
  templateUrl: './assessment-average-rating.component.html',
  styleUrls: ['./assessment-average-rating.component.css']
})
export class AssessmentAverageRatingComponent implements OnInit {

  finalAverageRating: Observable<ComputedScore>

  @Input()
  averageRating: TopicRatingResponse
  disableRating: number = 0

  @Input()
  topicId: number

  averageRatingTitle = data_local.TOPIC_AVERAGE_RATING.TITLE;

  constructor(private store: Store<TopicRatingResponse>) {
    this.finalAverageRating = this.store.select(fromReducer.getAverageRating)

  }

  ngOnInit(): void {
    this.finalAverageRating.subscribe(data => {
      if (data !== undefined) {
        if (this.averageRating.topicId === data.scoreDetails.topicId) {
          this.averageRating.rating = data.scoreDetails.rating
        }
      }
    })
  }
}
