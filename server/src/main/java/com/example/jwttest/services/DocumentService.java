package com.example.jwttest.services;


import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;


import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.example.jwttest.models.CommentDto;
import com.example.jwttest.models.Comment;
import com.example.jwttest.models.Document;
import com.example.jwttest.models.DocumentDto;
import com.example.jwttest.models.DocumentFile;
import com.example.jwttest.models.ReviewerValidation;
import com.example.jwttest.models.User;
import com.example.jwttest.repo.DocumentFileRepository;
import com.example.jwttest.repo.DocumentRepository;
import com.example.jwttest.repo.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final DocumentFileRepository documentFileRepository;
    private final UserRepository userRepository;

    public DocumentDto createDocument(MultipartFile file, List<String> reviewerEmails,String creatorEmail)  {
        Document document = new Document();
        document.setFileName(file.getOriginalFilename());
        DocumentFile documentFile=new DocumentFile();
        try {
            documentFile.setFileData(file.getBytes());
        } catch (IOException e) {
            
            System.err.println("error uploading");
            e.printStackTrace();
        } 

        //save file only after docuemnt saved succesflly
        documentFileRepository.save(documentFile);


        User creator=userRepository.findByEmail(creatorEmail).orElseThrow();
        document.setCreator(creator);
        document.setCreatedAt(LocalDateTime.now());

        Set<User> reviewers=userRepository.findAllByEmailIn(reviewerEmails); 
        for (User reviewer : reviewers) {
            document.addReviewerValidation(new ReviewerValidation(reviewer));
        }
        return new DocumentDto(documentRepository.save(document));
    }

    public Document getDocumentPdf(Long documentId) {
        Document document=documentRepository.findById(documentId).orElseThrow(()->new RuntimeException("document not found"));
        return document;
    }

    public DocumentDto getDocument(Long id){
        return documentRepository.findById(id).map(DocumentDto::new)
        .orElseThrow(()->new RuntimeException("document not found"));

    }

    public DocumentDto validateDocument(Long id,String reviewerEmail){
        Document document = documentRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Document not found"));
        // Update the validation status for the specified reviewer email
        //Map<String, Boolean> validationStatus = document.getValidationStatus();
        //validationStatus.put(reviewerEmail, true); // Set validation status to true
        //document.setValidationStatus(validationStatus);// Set the updated validation status map back to the document
        return new DocumentDto(documentRepository.save(document));

        //add progress attribute starts with 0 within each validation check if its equal to the size of the hashmap
        //if equeal setvalidation of document true
    }

    public List<DocumentDto> getAll(){
        List<Document> documents=documentRepository.findAll();
        return documents.stream()
                    .map(DocumentDto::new)
                    .collect(Collectors.toList());
    }

    public Comment addCommentToDocument(CommentDto request) {
        System.out.println("add comment request: "+request);
        Document document = documentRepository.findById(request.getDocumentId())
                                .orElseThrow(() -> new RuntimeException("Document not found"));

        Comment newComment=new Comment(request.getAuthor(),request.getContent(),request.getCreatedAt(),request.getDocumentId());
        document.getComments().add(newComment);
        documentRepository.save(document);
        return newComment;
    }

    public Map<String, List<Comment>>  getAllCommentsForDocument(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        List<Comment> comments= document.getComments();

        Map<String, List<Comment>> responseData = new HashMap<>();
        responseData.put("comments", comments);
        return responseData;
    }

    /* public List<DocumentDto> getDocumentsForReview(String reviewerEmail) {
        // Retrieve both reviewed and unreviewed documents for the reviewer
        List<Document> documents=documentRepository.findByReviewerEmail(reviewerEmail);
        return documents.stream()
                    .map(DocumentDto::new)
                    .collect(Collectors.toList());
    } */

}
