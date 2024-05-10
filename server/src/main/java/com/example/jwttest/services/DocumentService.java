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

import com.example.jwttest.dtos.AddCommentRequest;
import com.example.jwttest.dtos.CommentDto;
import com.example.jwttest.dtos.CreatorDto;
import com.example.jwttest.dtos.DocumentDto;
import com.example.jwttest.dtos.ReviewerDto;
import com.example.jwttest.dtos.ValidationDto;
import com.example.jwttest.models.Comment;
import com.example.jwttest.models.Document;
import com.example.jwttest.models.DocumentFile;
import com.example.jwttest.models.Validation;
import com.example.jwttest.models.User;
import com.example.jwttest.repo.CommentRepository;
import com.example.jwttest.repo.DocumentFileRepository;
import com.example.jwttest.repo.DocumentRepository;
import com.example.jwttest.repo.ValidationRepository;
import com.example.jwttest.repo.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final CommentRepository commentRepository;
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

        
        User creator=userRepository.findByEmail(creatorEmail).orElseThrow();
        document.setCreator(creator);
        document.setCreatedAt(LocalDateTime.now());

        documentFile.setDocument(document);
        
        DocumentDto documentDto=new DocumentDto(documentRepository.save(document));

        //findbyids
        Set<User> reviewers=userRepository.findAllByEmailIn(reviewerEmails);

        Set<Validation> validationSet = new HashSet<>(); 
        for (User reviewer : reviewers) {
            validationSet.add(new Validation(reviewer,document));
        }
        validationRepository.saveAll(validationSet);
        //send emails to reviewers
        documentFileRepository.save(documentFile);
        return documentDto ;
    }

    public void sendEmailToReviewers(List<String> reviewerEmails){
        
        for(String reviewerEmail :reviewerEmails){
           // String link = "http://localhost:4200/auth/reset-password?token="+token;
            String message="Please click on the link below to reset your password";
            //emailService.send(email, "Please click on the link below to confirm your email address:\n"+link);
            //emailService.sendHtmlEmail(reviewerEmail, name, link, message,"Reset now");
        }

    }

    public DocumentFile getDocumentFile(Long documentId) {
        System.out.println("document id :"+documentId);
        DocumentFile documentFile=documentFileRepository.findByDocumentId(documentId).orElseThrow(()->new RuntimeException("document file not found"));
        return documentFile;
    }



    public DocumentDto getDocument(Long id){
        return documentRepository.findById(id).map(DocumentDto::new)
        .orElseThrow(()->new RuntimeException("document not found"));

    }

    

    public Validation validateDocument(Long id,String reviwerEmail){
        Validation validation=validationRepository.findByReviewerEmailAndDocumentId(reviwerEmail,id).orElseThrow();
        validation.setValidated(true);
        // Fetch the associated document
        Document document = validation.getDocument();
        int currentValidations = document.getTotalValidations() + 1;
        document.setTotalValidations(currentValidations);
        if (currentValidations == document.getTotalReviewers()) {
            document.setValidated(true);
        }
        documentRepository.save(document);
        return validationRepository.save(validation);
    }

    public ReviewerDto getDocumentForReview(Long id,String reviwerEmail){
        Validation validation=validationRepository.findByReviewerEmailAndDocumentId(reviwerEmail,id).orElseThrow();
        return new ReviewerDto(validation);

    }

    public List<ReviewerDto> getDocumentsForReviewer(Long id){
        List<Validation> reviewerValidations=validationRepository.findByReviewerId(id);
        //List<Validation> reviewerValidations=validationRepository.findByReviewerEmail(email);
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

    public List<ValidationDto> getValidationsForDocument(Long id){
        List<Validation> validations=validationRepository.findByDocumentId(id);
        return validations.stream()
                            .map(ValidationDto::new)
                            .collect(Collectors.toList());   
    }

    public List<DocumentDto> getAll(){
        List<Document> documents=documentRepository.findAll();
        return documents.stream()
                    .map(DocumentDto::new)
                    .collect(Collectors.toList());
    }

    public Comment addCommentToDocument(AddCommentRequest request,Long documentId) {
        Comment comment=new Comment(request,documentId);
        commentRepository.save(comment);
        return comment;
    }

    public Map<String, List<Comment>>  getAllCommentsForDocument(Long documentId) {
        //fetch from validation to get validation status or check in server 
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        List<Comment> comments= document.getComments();

        Map<String, List<Comment>> responseData = new HashMap<>();
        responseData.put("comments", comments);
        return responseData;
    }

    

}
