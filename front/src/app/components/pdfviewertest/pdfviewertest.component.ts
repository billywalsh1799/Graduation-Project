import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';


@Component({
  selector: 'app-pdfviewertest',
  templateUrl: './pdfviewertest.component.html',
  styleUrls: ['./pdfviewertest.component.css']
})
export class PdfviewertestComponent {

  constructor(private http: HttpClient) {}

    openPdf() {
    const documentId = 9; // Replace with the actual document ID
    this.http.get(`http://localhost:8080/api/documents/document/${documentId}/pdf`, { responseType: 'blob' })
      .subscribe(response => {
        const file = new Blob([response], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, '_blank');
        
      });
  }  
 


 
}
