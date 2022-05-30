import {Router} from "@angular/router";
import {NgZone} from "@angular/core";

export class AppComponent {
  constructor(
    private router: Router,
    private ngZone: NgZone,
  ) {}

  // Method Cypress will call
  public navigateByUrl(url: string) {
    this.ngZone.run(() => {
      this.router.navigateByUrl(url);
    });
  }
}
