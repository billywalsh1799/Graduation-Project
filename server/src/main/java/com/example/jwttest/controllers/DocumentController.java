package com.example.jwttest.controllers;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.jwttest.dtos.AddCommentRequest;
import com.example.jwttest.dtos.CreatorDto;
import com.example.jwttest.dtos.DocumentDto;
import com.example.jwttest.dtos.DocumentRequest;
import com.example.jwttest.dtos.DocumentReviewDto;
import com.example.jwttest.dtos.DocumentReviewRequest;
import com.example.jwttest.dtos.DocumentValidationRequest;
import com.example.jwttest.dtos.ReviewerDto;
import com.example.jwttest.dtos.ReviewerStatisticsDto;
import com.example.jwttest.dtos.UploadedDocumentDto;
import com.example.jwttest.dtos.ValidationDto;
import com.example.jwttest.models.Comment;
import com.example.jwttest.models.DocumentFile;
import com.example.jwttest.models.Validation;
import com.example.jwttest.services.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@CrossOrigin
public class DocumentController {

    private final DocumentService documentService;
    @PostMapping("/create")
    public ResponseEntity<DocumentDto> createDocument(@RequestParam("file") MultipartFile file,
                                    @RequestParam("reviewerEmails") List<String> reviewerEmails,
                                    @RequestParam("creatorEmail") String creatorEmail,
                                    @RequestParam("type") String type,
                                    @RequestParam("note") String note
                                    )   {
        return new ResponseEntity<>(documentService.createDocument(file, reviewerEmails,creatorEmail,type,note),HttpStatus.OK);
    }

    @GetMapping("/")
    public ResponseEntity<List<UploadedDocumentDto>> getAll() {
        return new ResponseEntity<>(documentService.getAll(),HttpStatus.OK);
    }
    @GetMapping("/uploaders")
    public ResponseEntity<List<String>> getAllUploaders() {
        return new ResponseEntity<>(documentService.getAllUploaders(),HttpStatus.OK);
    }
    @GetMapping("/reviewers")
    public ResponseEntity<List<String>> getAllReviewers() {
        return new ResponseEntity<>(documentService.getAllReviewers(),HttpStatus.OK);
    }
    

    @PostMapping("/document")
    public ResponseEntity<DocumentDto> getDocument(@RequestBody  DocumentRequest request) {
        return new ResponseEntity<>(documentService.getDocument(request.getDocumentId(),request.getReviewerId()),HttpStatus.OK);
    }

    @PostMapping("/document/validation-status")
    public ResponseEntity<Map<String,Boolean>> getDocumentValidationStatus(@RequestBody DocumentReviewRequest request) {
        return new ResponseEntity<>(documentService.getDocumentValidationStatus(request.getReviewerId(),request.getDocumentId()),HttpStatus.OK);
    }

    
    @PostMapping("/{id}/comment")
    public ResponseEntity<Comment> addCommentToDocument(@RequestBody AddCommentRequest request,@PathVariable Long  id) {
        return new ResponseEntity<>(documentService.addCommentToDocument(request,id),HttpStatus.OK);
    }



    
    //validation button
    @PostMapping("/{id}/validate")
    public ResponseEntity<Validation> validateDocument(@RequestBody DocumentValidationRequest request) {
       return new ResponseEntity<>(documentService.validateDocument(request.getReviewerId(),request.getDocumentId()),HttpStatus.OK);
    }


    //documentpage
    @PostMapping("/review")
    public ResponseEntity<DocumentReviewDto> getDocumentToReview(@RequestBody DocumentReviewRequest request) {
       return new ResponseEntity<>(documentService.getDocumentForReview(request.getDocumentId(),request.getReviewerId()),HttpStatus.OK);
    }



    //for creator page table
    @GetMapping("/creator/{id}")
    public ResponseEntity<List<CreatorDto>> getDocumentsForCreator(@PathVariable Long id){
        return new ResponseEntity<>(documentService.getDocumentsForCreator(id),HttpStatus.OK);

    }


    //for reviewer page table
    @GetMapping("/reviewer/{id}")
    public ResponseEntity<List<ReviewerDto>> getDocumentsForReviewer(@PathVariable Long id){
        return new ResponseEntity<>(documentService.getDocumentsForReviewer(id),HttpStatus.OK);

    }
    

    /* //for creator page popup
    @GetMapping("/validations/{id}")
    public ResponseEntity<List<ValidationDto>> getValidationsForDocument(@PathVariable Long id){
        return new ResponseEntity<>(documentService.getValidationsForDocument(id),HttpStatus.OK);

    } */

    //for reviewer page table
    @GetMapping("/reviewer/{id}/statistics")
    public ResponseEntity<ReviewerStatisticsDto> getReviewerStatistics(@PathVariable Long id){
        return new ResponseEntity<>(documentService.getReviewerStatistics(id),HttpStatus.OK);

    }

    
    
    @GetMapping("/{id}/pdf")
        public ResponseEntity<Resource> getDocumentPdf(@PathVariable Long id) {
            DocumentFile documentFile = documentService.getDocumentFile(id);
            byte[] pdfData =documentFile.getFileData();

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=" + "filename" + ".pdf");

            return ResponseEntity
                    .ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(new ByteArrayResource(pdfData));
        }
    
}
