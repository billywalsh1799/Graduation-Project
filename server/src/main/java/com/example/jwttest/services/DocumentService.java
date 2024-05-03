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
import com.example.jwttest.models.User;
import com.example.jwttest.models.UserDto;
import com.example.jwttest.repo.CommentRepository;
import com.example.jwttest.repo.DocumentRepository;
import com.example.jwttest.repo.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    /* private final CommentRepository commentRepository; */

    public Document createDocument(MultipartFile file, List<String> reviewerEmails,String creatorEmail)  {
        Document document = new Document();
        document.setFileName(file.getOriginalFilename());
        try {
            document.setFileData(file.getBytes());
        } catch (IOException e) {
            
            System.err.println("error uploading");
            e.printStackTrace();
        }
        Set<User> reviewers = userRepository.findAllByEmailIn(reviewerEmails);
        document.setReviewers(reviewers);
        User creator=userRepository.findByEmail(creatorEmail).orElseThrow();
        document.setCreator(creator);
        document.setCreatedAt(LocalDateTime.now());
        return documentRepository.save(document);
    }

    public Document getDocumentPdf(Long documentId) {
        Document document=documentRepository.findById(documentId).orElseThrow(()->new RuntimeException("document not found"));
        return document;
    }

    public DocumentDto getDocument(Long id){
        //Document document=documentRepository.findById(id).orElseThrow(()->new RuntimeException("document not found"));
       /*  return new DocumentDto(document.getId(),document.getFileName(),document.getReviewers(),document.getCreator(),
                    document.getComments(),document.getCreatedAt()); */
        return documentRepository.findById(id).map(DocumentDto::new)
        .orElseThrow(()->new RuntimeException("document not found"));

    }

    public DocumentDto validateDocument(Long id){
        Document document = documentRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Document not found"));
        document.setValidated(true);
        return new DocumentDto(documentRepository.save(document));
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

}
