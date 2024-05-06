package com.example.jwttest.services;


import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;


import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.jwttest.dtos.CommentDto;
import com.example.jwttest.dtos.CreatorDto;
import com.example.jwttest.dtos.DocumentDto;
import com.example.jwttest.dtos.ReviewerDto;
import com.example.jwttest.models.Comment;
import com.example.jwttest.models.Document;
import com.example.jwttest.models.DocumentFile;
import com.example.jwttest.models.Validation;
import com.example.jwttest.models.User;
import com.example.jwttest.repo.DocumentFileRepository;
import com.example.jwttest.repo.DocumentRepository;
import com.example.jwttest.repo.ValidationRepository;
import com.example.jwttest.repo.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final DocumentFileRepository documentFileRepository;
    private final ValidationRepository validationRepository;
    private final UserRepository userRepository;

    //fetch by user for reviwwer page
    //fatch by creator for created documents
    //when open popup fetch validation by document

    public DocumentDto createDocument(MultipartFile file, List<String> reviewerEmails,String creatorEmail)  {
        Document document = new Document();
        document.setFileName(file.getOriginalFilename());
        document.setTotalReviewers(reviewerEmails.size());
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

        //findbyids
        Set<User> reviewers=userRepository.findAllByEmailIn(reviewerEmails);

        Set<Validation> validationSet = new HashSet<>(); 
        for (User reviewer : reviewers) {
            validationSet.add(new Validation(reviewer));
        }
        validationRepository.saveAll(validationSet);
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

    public void validateDocument(Long id,Long reviwerId){
        Validation validation=validationRepository.findByReviewerIdAndDocumentId(id, reviwerId).orElseThrow();
        validation.setValidated(true);
        validationRepository.save(validation);

        // Fetch the associated document
        Document document = validation.getDocument();
        int currentValidations = document.getTotalValidations() + 1;
        document.setTotalValidations(currentValidations);
        if (currentValidations == document.getTotalReviewers()) {
            document.setValidated(true);
        }
        documentRepository.save(document);

    }

    public List<ReviewerDto> getDocumentsForReviewer(Long id){
        List<Validation> reviewerValidations=validationRepository.findByReviewerId(id);
        return reviewerValidations.stream()
                    .map(ReviewerDto::new)
                    .collect(Collectors.toList());
    }

    public List<CreatorDto> getDocumentsForCreator(Long id){
        List<Document> creatorDocuments=documentRepository.findByCreatorId(id);
        return creatorDocuments.stream()
                            .map(CreatorDto::new)
                            .collect(Collectors.toList());
                            
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
