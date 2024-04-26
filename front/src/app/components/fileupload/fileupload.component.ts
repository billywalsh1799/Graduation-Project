import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, map, startWith } from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FileuploadComponent {
  reviewerCtrl = new FormControl('');
  filteredReviewers: Observable<string[]>;
  reviewers: string[] = [];
  allReviewers: string[] = [];

  @ViewChild('reviewerInput') reviewerInput!: ElementRef<HTMLInputElement>;

  constructor(private userService: UserService) {
    this.loadAllReviewers();
    this.filteredReviewers = this.reviewerCtrl.valueChanges.pipe(
      startWith(null),
      map((reviewer: string | null) => (reviewer ? this._filter(reviewer) : this.allReviewers.slice())),
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our reviewer
    if (value) {
      this.reviewers.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.reviewerCtrl.setValue(null);
  }

  remove(reviewer: string): void {
    const index = this.reviewers.indexOf(reviewer);

    if (index >= 0) {
      this.reviewers.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedReviewer = event.option.viewValue;
  
    // Check if the selected reviewer is already in the list
    if (!this.reviewers.includes(selectedReviewer)) {
      this.reviewers.push(selectedReviewer);
      this.reviewerInput.nativeElement.value = '';
      this.reviewerCtrl.setValue(null);
    } else {
      this.reviewerInput.nativeElement.value = '';
      this.reviewerCtrl.setValue(null);
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allReviewers.filter(reviewer => reviewer.toLowerCase().includes(filterValue));
  }

  loadAllReviewers() {
    this.userService.getReviewers().subscribe({
      next: res => {
        console.log(res);
        this.allReviewers = res.reviewers;
      },
      error: err => {
        console.log("error loading reviewers", err);
      }
    })
  }

  

}
