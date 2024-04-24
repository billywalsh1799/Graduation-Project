import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  myControl = new FormControl('');

  options!: Observable<string[]>;

  ngOnInit() {
    this.options = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const filterValue = String(value).toLowerCase(); // Convert value to string before calling toLowerCase()
        return this.allOptions.filter(option => option.toLowerCase().includes(filterValue));
      })
    );
  }

  allOptions = ['Apple', 'Banana', 'Orange', 'Pear', 'Grape'];

  selectedOptions: string[] = [];

  addOption(option: string) {
    this.selectedOptions.push(option);
    this.myControl.setValue(''); // Clear the input after selecting an option
  }

  removeOption(option: string) {
    this.selectedOptions = this.selectedOptions.filter(item => item !== option);
    this.myControl.setValue(''); // Clear the input after removing an option
  }
}
