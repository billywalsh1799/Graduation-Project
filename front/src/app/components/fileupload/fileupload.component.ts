import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, map, startWith } from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { UserService } from 'src/app/services/user.service';
import { DocumentService } from 'src/app/services/document.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FileuploadComponent {
  reviewerCtrl = new FormControl('');
  reviewers: string[] = [];

  allReviewers: string[] = [];
  filteredReviewers:String[]=[]
  selectedFile: File | null = null;


  loading: boolean = false;

  type:string=""

  documentTypes:string[]=["Cover letter","Resume","Bill"]


  @ViewChild('reviewerInput') reviewerInput!: ElementRef<HTMLInputElement>;

  constructor(private userService: UserService,private documentService:DocumentService,private authService:AuthService,
    private snackBar: MatSnackBar
  ) {
    this.loadAllReviewers();
   /*  this.filteredReviewers = this.reviewerCtrl.valueChanges.pipe(
      startWith(null),
      map((reviewer: string | null) => (reviewer ? this._filter(reviewer) : this.allReviewers.slice())),
    ); */
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our reviewer
    if (value) {
      this.reviewers.push(value);
      this.filteredReviewers = this.filteredReviewers.filter(reviewer => reviewer !== value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.reviewerCtrl.setValue(null);
  }

  remove(reviewer: string): void {
    const index = this.reviewers.indexOf(reviewer);

    if (index >= 0) {
      this.reviewers.splice(index, 1);
      this.filteredReviewers.push(reviewer);
    }

    console.log("filtered reviewers",this.filteredReviewers)
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedReviewer = event.option.viewValue;
  
    // Check if the selected reviewer is already in the list
    if (!this.reviewers.includes(selectedReviewer)) {
      this.reviewers.push(selectedReviewer);
      this.filteredReviewers = this.filteredReviewers.filter(reviewer => reviewer !== selectedReviewer);
      console.log("filtered reviewers",this.filteredReviewers)
      
    } 
    this.reviewerInput.nativeElement.value = '';
    //this.filteredReviewers=this.allReviewers
    this.filterReviewers("")
    this.reviewerCtrl.setValue(null);
    
  }

  
  loadAllReviewers() {
    this.userService.getReviewers().subscribe({
      next: res => {
        console.log(res);
        this.allReviewers = res.reviewers;
        this.filteredReviewers=res.reviewers
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

    console.log(this.reviewers)
    if (!this.selectedFile) {
      // Handle file not selected error
      //from error mat
      return;
    }

    this.loading = true;
    
    const creatorEmail =this.getCreator();
    this.documentService.createDocument(this.selectedFile,this.reviewers,creatorEmail,'type','note').subscribe({
      next: res => {
        console.log('Document created successfully:', res);
        this.loading = false;
        this.snackBar.open('Document uploaded successfully:', 'Close', {
          duration: 5000,
          verticalPosition: 'top'
        });
        
      },
      error: err => {
        console.error('Error creating document:', err);
        
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

  searchReviewer(){
    if(this.reviewerCtrl.value){
      this.filterReviewers(this.reviewerCtrl.value)
    }
    else {
      this.filteredReviewers = this.allReviewers;
    }

  }

  filterReviewers(value: string) {
    const filterValue = value.toLowerCase();
    //this.filteredReviewers=this.allReviewers.filter(reviewer => reviewer.toLowerCase().startsWith(filterValue));
    this.filteredReviewers=this.allReviewers.filter(reviewer => reviewer.toLowerCase().startsWith(filterValue) && !this.reviewers.includes(reviewer));
  }



  

}
