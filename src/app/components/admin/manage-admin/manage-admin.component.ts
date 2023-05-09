/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import { Component, OnInit } from '@angular/core';
import {AppServiceService} from "../../../services/app-service/app-service.service";

@Component({
  selector: 'app-manage-admin',
  templateUrl: './manage-admin.component.html',
  styleUrls: ['./manage-admin.component.css']
})
export class ManageAdminComponent implements OnInit {

  constructor(private appService: AppServiceService) { }

  ngOnInit(): void {

  }

}
