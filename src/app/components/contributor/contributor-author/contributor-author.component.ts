import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contributor-author',
  templateUrl: './contributor-author.component.html',
  styleUrls: ['./contributor-author.component.css']
})
export class ContributorAuthorComponent implements OnInit {
  searchBarText: string = "Search questions";
  searchText: string;
  isEdit: boolean;
  text: string = "Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing?";
  sentToReview: boolean = false;
  clicked: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  editQuestion() {
    this.isEdit = true;
    return this.isEdit;
  }

  sendForReview() {
    this.sentToReview = true
  }

  cancelChanges() {
    this.isEdit = false
  }

  isCardClicked() {
    this.clicked = true
  }
}
