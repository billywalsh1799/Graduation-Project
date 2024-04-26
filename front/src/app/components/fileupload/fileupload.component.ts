import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, map, startWith } from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { UserService } from 'src/app/services/user.service';
import { DocumentService } from 'src/app/services/document.service';
import { AuthService } from 'src/app/services/auth.service';

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
  selectedFile: File | null = null;

  @ViewChild('reviewerInput') reviewerInput!: ElementRef<HTMLInputElement>;

  constructor(private userService: UserService,private documentService:DocumentService,private authService:AuthService) {
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

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  createDocument(): void {
    if (!this.selectedFile) {
      // Handle file not selected error
      //from error mat
      return;
    }
    
    //extract from jwt subject
    //const creatorEmail = 'smoalla1799@gmail.com'; // Replace with actual creator's email
     // Replace with actual creator's email
  
    // Create FormData object
    //copy this in the service to reduce code 
    //console.log("file",this.selectedFile)

    //const formData: FormData = new FormData();
    //formData.append('file', this.selectedFile);
    //formData.append('creatorEmail', creatorEmail);
    //this.reviewers.forEach(email => formData.append('reviewerEmails', email));
    // Call DocumentService to create document
    const creatorEmail =this.getCreator();
    this.documentService.createDocument(this.selectedFile,this.reviewers,creatorEmail).subscribe({
      next: res => {
        console.log('Document created successfully:', res);
        // Reset form or navigate to another page
      },
      error: err => {
        console.error('Error creating document:', err);
        // Handle error
      }
    });
  }

  getCreator(){
    let sub=this.authService.getSubject()
    if(sub)
      return sub
    else
      return ""

  }

  clearFile(): void {
    this.selectedFile = null;
  }

  

}
