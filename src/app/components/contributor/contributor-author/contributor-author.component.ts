import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contributor-author',
  templateUrl: './contributor-author.component.html',
  styleUrls: ['./contributor-author.component.css']
})
export class ContributorAuthorComponent implements OnInit {
  searchBarText: string = "Search questions";
  searchText: string;

  constructor() { }

  ngOnInit(): void {
  }

}
