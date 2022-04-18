import {Component, Inject, OnInit} from '@angular/core';
import {OKTA_AUTH} from '@okta/okta-angular';
import {OktaAuth} from '@okta/okta-auth-js';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAuthenticated?: boolean;

  constructor(@Inject(OKTA_AUTH) public oktaAuth: OktaAuth) {
  }

  username?: string
  async ngOnInit(): Promise<void> {
    this.username = (await this.oktaAuth.getUser()).name;
  }
}
