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
import com.example.jwttest.dtos.CreatorDto;
import com.example.jwttest.dtos.DocumentDto;
import com.example.jwttest.dtos.DocumentReviewDto;
import com.example.jwttest.dtos.ReviewerDto;
import com.example.jwttest.dtos.ReviewerStatisticsDto;
import com.example.jwttest.dtos.UploadedDocumentDto;
import com.example.jwttest.dtos.ValidationDto;
import com.example.jwttest.email.EmailService;
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
    private final EmailService emailService;

    //fetch by user for reviwwer page
    //fatch by creator for created documents
    //when open popup fetch validation by document

    public DocumentDto createDocument(MultipartFile file, List<String> reviewerEmails,String creatorEmail,String type,String note)  {
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

        document.setType(type);
        document.setNote(note);

        documentFile.setDocument(document);
        
        DocumentDto documentDto=new DocumentDto(documentRepository.save(document),false);

        //findbyids
        Set<User> reviewers=userRepository.findAllByEmailIn(reviewerEmails);

        Set<Validation> validationSet = new HashSet<>(); 
        for (User reviewer : reviewers) {
            //send email to reviewer
            sendEmailToReviewer(reviewer, documentDto.getId());
            validationSet.add(new Validation(reviewer,document));
        }
        validationRepository.saveAll(validationSet);
        //send emails to reviewers
        documentFileRepository.save(documentFile);
        return documentDto ;
    }

    public void sendEmailToReviewer(User reviewer,Long documentId){
        String link = "http://localhost:4200/document/" + documentId;
        String message="You have a new document to review";
        String reciever=reviewer.getEmail();
        String name=reviewer.getFirstname();
        emailService.sendHtmlEmail(reciever, name, link, message,"Review now",
        "","Document Review");  
    }

    public DocumentFile getDocumentFile(Long documentId) {
        System.out.println("document id :"+documentId);
        DocumentFile documentFile=documentFileRepository.findByDocumentId(documentId).orElseThrow(()->new RuntimeException("document file not found"));
        return documentFile;
    }



    public DocumentDto getDocument(Long documentId,Long reviwerId){
        Document document=documentRepository.findById(documentId).orElseThrow(()->new RuntimeException("document file not found"));
        boolean validation=false;
        if(document.getCreator().getId()!=reviwerId){
            Validation reviewerValidation=validationRepository.findByReviewerIdAndDocumentId(reviwerId, documentId).orElseThrow(()->new RuntimeException("validation not found"));
            validation=reviewerValidation.isValidated();
        }
        return new DocumentDto(document,validation);
    }

    public Map<String,Boolean> getDocumentValidationStatus(Long reviewerId,Long documentId){
        Validation validation=validationRepository.findByReviewerIdAndDocumentId(reviewerId, documentId).orElseThrow();
        Map<String, Boolean> responseData = new HashMap<>();
        responseData.put("hasValidated", validation.isValidated());
        return responseData;

    } 

    public Validation validateDocument(Long reviewerId,Long documentId){
        Validation validation=validationRepository.findByReviewerIdAndDocumentId(reviewerId,documentId).orElseThrow();
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

    public DocumentReviewDto getDocumentForReview(Long documentId,Long reviwerId){
        Validation validation=validationRepository.findByReviewerIdAndDocumentId(reviwerId, documentId).orElseThrow();
        return new DocumentReviewDto(validation);

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


    public List<UploadedDocumentDto> getAll(){
        List<Document> documents=documentRepository.findAll();
        return documents.stream()
                    .map(UploadedDocumentDto::new)
                    .collect(Collectors.toList());
    }


    //for uploaders filter in uploaded documents page
    public List<String> getAllUploaders(){
        List<User> documents=documentRepository.findAllCreators();
        return documents.stream()
                    .map(user->user.getUsername())
                    .collect(Collectors.toList());
    }


    //for reviewers filter in uploaded documents page
    public List<String> getAllReviewers(){
        List<User> documents=validationRepository.findAllReviewers();
        return documents.stream()
                    .map(user->user.getUsername())
                    .collect(Collectors.toList());
    }

    public Comment addCommentToDocument(AddCommentRequest request,Long documentId) {
        Comment comment=new Comment(request,documentId);
        commentRepository.save(comment);
        return comment;
    }

    public ReviewerStatisticsDto getReviewerStatistics(Long userId){
        Long totalUploadedDocuments=documentRepository.countByCreatorId(userId);
        Long totalAssignedDocuments=validationRepository.countByReviewerId(userId);
        return new ReviewerStatisticsDto(totalAssignedDocuments,totalUploadedDocuments);
    }



}
