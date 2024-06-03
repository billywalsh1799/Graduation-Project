import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { UserService } from 'src/app/services/user.service';
import { DocumentService } from 'src/app/services/document.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FileuploadComponent implements OnInit {

  reviewerCtrl = new FormControl('');
  reviewers: string[] = [];

  allReviewers: string[] = [];
  reviewerRoles:any=[]
  filteredReviewers:String[]=[]
  selectedFile: File | null = null;


  loading: boolean = false;

  type:string=""

  documentTypes:string[]=["Cover letter","Resume","Bill"]


  @ViewChild('reviewerInput') reviewerInput!: ElementRef<HTMLInputElement>;

  constructor(private userService: UserService,private documentService:DocumentService,private authService:AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAllReviewers();
  }

  onDocumentTypeChange(event: MatSelectChange) {
    console.log("select event",event.value)
    if (event.value === "Resume") {
      this.addTeamleadReviewers();
    }
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
        //this.allReviewers = res.reviewers;
        //this.filteredReviewers=res.reviewers
        this.reviewerRoles=res.reviewers
        this.allReviewers=res.reviewers.map((reviewer:any)=>reviewer.email)
        this.filteredReviewers=res.reviewers.map((reviewer:any)=>reviewer.email)
        console.log("filtered rev",this.filteredReviewers)
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
    /* else {
      this.filteredReviewers = this.allReviewers;
    } */
    else {
      // Reset filtered reviewers to include all reviewers except the selected ones
      this.filteredReviewers = this.allReviewers.filter(reviewer => !this.reviewers.includes(reviewer));
    }

  }

  filterReviewers(value: string) {
    const filterValue = value.toLowerCase();
    //this.filteredReviewers=this.allReviewers.filter(reviewer => reviewer.toLowerCase().startsWith(filterValue));
    this.filteredReviewers=this.allReviewers.filter((reviewer:any) => reviewer.toLowerCase().startsWith(filterValue) && !this.reviewers.includes(reviewer));
   
  }

  addTeamleadReviewers(): void {
    const teamleadReviewers = this.reviewerRoles
      .filter((reviewer:any) => reviewer.roles.includes("ROLE_TEAM_LEAD"))
      .map((reviewer:any) => reviewer.email);

    teamleadReviewers.forEach((reviewer:any) => {
      if (!this.reviewers.includes(reviewer)) {
        this.reviewers.push(reviewer);
        this.filteredReviewers = this.filteredReviewers.filter(r => r !== reviewer);
      }
    });

    console.log("Teamlead reviewers added:", teamleadReviewers);
  }

}
