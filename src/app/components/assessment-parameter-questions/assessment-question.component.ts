import {Component, Input, OnInit} from '@angular/core';
/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */
import {Notes} from "../../types/answerRequest";
import {QuestionStructure} from "../../types/questionStructure";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  concat,
  debounceTime, defer, delay,
  distinctUntilChanged, empty, filter, mapTo,
  mergeMap,
  Observable, of,
  share,
  Subject,
  switchMap,
  takeUntil,
  tap
} from "rxjs";
import {AssessmentNotes} from "../../types/assessmentNotes";
import {saveAssessmentData} from "../assessment-rating-and-recommendation/topic-level-assessment.component";


export const assessmentData = [{}]

enum FormStatus {
  Saving = 'Saving',
  Saved = 'Saved',
  Idle = ''
}


@Component({
  selector: 'app-assessment-question',
  templateUrl: './assessment-question.component.html',
  styleUrls: ['./assessment-question.component.css']
})

export class AssessmentQuestionComponent implements OnInit {
  @Input()
  questionDetails: QuestionStructure;
  @Input()
  assessmentStatus: string;
  @Input()
  answerInput: Notes;
  @Input()
  initial: number
  @Input()
  assessmentId: number

  textarea: number = 0;
  form: FormGroup


  formStatus: FormStatus.Saving | FormStatus.Saved | FormStatus.Idle = FormStatus.Idle;

  constructor(private appService: AppServiceService, private _fb: FormBuilder, private _snackBar: MatSnackBar) {

  }

  note = new FormControl("");
  saveIndicator$: Observable<string>;
  saveCount = 0;
  assessmentNotes: AssessmentNotes ={
    assessmentId:0, questionId: 1 , notes:" "
  } ;

  ngOnInit() {
    this.note.valueChanges.pipe(
      debounceTime(100)
    ).subscribe({next: value => {
      this.assessmentNotes.assessmentId=this.assessmentId
      this.assessmentNotes.questionId= this.questionDetails.questionId
        if(value!="") {
          this.assessmentNotes.notes = value
        }
        this.appService.saveNotes(this.assessmentNotes).subscribe((_data) => {
            assessmentData.push(this.assessmentNotes);
          }
        )
        console.log(this.assessmentNotes)
      }});


    // const savesCompleted$ = inputToSave$.pipe(
    //   mergeMap(value => this.appService.(value)),
    //   tap(() => this.saveCount--),
    //   filter(() => !this.saveCount),
    //   mapTo(
    //     concat(
    //       of('Salvo!'),
    //       empty().pipe(delay(2000)),
    //       defer(() =>
    //         of(`Last  Saved: ${(Date.now(), 'dd/MM/yyyy hh:mm')}`)
    //       )
    //     )
    //   )
    // );

    // this.saveIndicator$ = merge(savesInProgress$, savesCompleted$).pipe(
    //   switchAll(),
    //   startWith('Form Saved')
    // );

    // inputToSave$.subscribe(this.appService.saveNotes);
  }



}

