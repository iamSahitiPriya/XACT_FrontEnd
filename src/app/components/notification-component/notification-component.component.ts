import {Component, Inject} from "@angular/core";
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from "@angular/material/snack-bar";

@Component({
  selector: 'app-notification-component',
  templateUrl: './notification-component.component.html',
  styleUrls: ['./notification-component.component.css']
})
export class NotificationSnackbarComponent {
  constructor(
    public sbRef: MatSnackBarRef<NotificationSnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {
  }
}
