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
import com.example.jwttest.models.Comment;
import com.example.jwttest.models.CommentDto;
import com.example.jwttest.models.Document;
import com.example.jwttest.models.DocumentDto;
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
    



    @GetMapping("/download/{documentId}")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long documentId) {
        //System.out.println("Request download ");
        // Get the document from the service
        Document document = documentService.getDocumentPdf(documentId);
        //System.out.println("document "+document);

        // Create ByteArrayResource from fileData
        ByteArrayResource resource = new ByteArrayResource(document.getFileData());

        // Set the headers for the response
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + document.getFileName());
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE);

        // Return ResponseEntity with ByteArrayResource and headers
        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(resource.contentLength())
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
    @GetMapping("/document/{id}/pdf")
    public ResponseEntity<Resource> getDocumentPdf(@PathVariable Long id) {
        Document document = documentService.getDocumentPdf(id);
        byte[] pdfData =document.getFileData();

        HttpHeaders headers = new HttpHeaders();
        //headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=document.pdf");
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + document.getFileName());

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new ByteArrayResource(pdfData));
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
    public ResponseEntity<DocumentDto> validateDocument(@PathVariable Long  id,@RequestBody Map<String,String> request) {
       return new ResponseEntity<>(documentService.validateDocument(id,request.get("reviewerEmail")),HttpStatus.OK);
    }
    
    /* @GetMapping("/review/{reviewerEmail}")
    public ResponseEntity<List<DocumentDto>> getDocumentsForReview(@PathVariable String reviewerEmail) {
        return new ResponseEntity<>(documentService.getDocumentsForReview(reviewerEmail),HttpStatus.OK);
    } */
    

    

    /* @GetMapping("/documents/{id}/{filename}/pdf")
        public ResponseEntity<Resource> getDocumentPdf(@PathVariable Long id, @PathVariable String filename) {
            Document document = documentService.getDocumentById(id);
            byte[] pdfData =document.getFileData();

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=" + filename + ".pdf");

            return ResponseEntity
                    .ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(new ByteArrayResource(pdfData));
        }
     */
}
