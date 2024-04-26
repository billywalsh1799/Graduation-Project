package com.example.jwttest.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.jwttest.models.Document;
import com.example.jwttest.services.DocumentService;


import lombok.RequiredArgsConstructor;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.core.io.Resource;


@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@CrossOrigin
public class DocumentController {

    private final DocumentService documentService;
    @PostMapping("/create")
    public Document createDocument(@RequestParam("file") MultipartFile file,
                                    @RequestParam("reviewerEmails") List<String> reviewerEmails,
                                    @RequestParam("creatorEmail") String creatorEmail)   {
        return documentService.createDocument(file, reviewerEmails,creatorEmail);
    }

    @GetMapping("/download/{documentId}")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long documentId) {
        System.out.println("Request download ");
        // Get the document from the service
        Document document = documentService.getDocumentById(documentId);
        System.out.println("document "+document);

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
    
}
