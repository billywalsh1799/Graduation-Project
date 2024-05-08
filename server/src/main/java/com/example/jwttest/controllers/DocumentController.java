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

import com.example.jwttest.dtos.CommentDto;
import com.example.jwttest.dtos.CreatorDto;
import com.example.jwttest.dtos.DocumentDto;
import com.example.jwttest.dtos.DocumentValidationRequest;
import com.example.jwttest.dtos.ReviewerDto;
import com.example.jwttest.dtos.ValidationDto;
import com.example.jwttest.models.Comment;
import com.example.jwttest.models.Document;
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
                                    @RequestParam("creatorEmail") String creatorEmail)   {
        return new ResponseEntity<>(documentService.createDocument(file, reviewerEmails,creatorEmail),HttpStatus.OK);
    }

    @GetMapping("/")
    public ResponseEntity<List<DocumentDto>> getAll() {
        return new ResponseEntity<>(documentService.getAll(),HttpStatus.OK);
    }
    

    @GetMapping("/document/{id}")
    public ResponseEntity<DocumentDto> getDocument(@PathVariable Long id) {
        return new ResponseEntity<>(documentService.getDocument(id),HttpStatus.OK);
    }
    

    @PostMapping("/comment")
    public ResponseEntity<Comment> addCommentToDocument(@RequestBody CommentDto request) {
        return new ResponseEntity<>(documentService.addCommentToDocument(request),HttpStatus.OK);
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<Map<String, List<Comment>>> getAllCommentsForDocument(@PathVariable Long  id) {
        return new ResponseEntity<>(documentService.getAllCommentsForDocument(id),HttpStatus.OK);
    }
    
    @PostMapping("/{id}/validate")
    public ResponseEntity<Validation> validateDocument(@RequestBody DocumentValidationRequest request) {
       return new ResponseEntity<>(documentService.validateDocument(request.getDocumentId(),request.getReviewerEmail()),HttpStatus.OK);
    }

    @GetMapping("/creator/{id}")
    public ResponseEntity<List<CreatorDto>> getDocumentsForCreator(@PathVariable Long id){
        return new ResponseEntity<>(documentService.getDocumentsForCreator(id),HttpStatus.OK);

    }

    @GetMapping("/reviewer/{id}")
    public ResponseEntity<List<ReviewerDto>> getDocumentsForReviewer(@PathVariable Long id){
        return new ResponseEntity<>(documentService.getDocumentsForReviewer(id),HttpStatus.OK);

    }
    

    @GetMapping("/validations/{id}")
    public ResponseEntity<List<ValidationDto>> getValidationsForDocument(@PathVariable Long id){
        return new ResponseEntity<>(documentService.getValidationsForDocument(id),HttpStatus.OK);

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
