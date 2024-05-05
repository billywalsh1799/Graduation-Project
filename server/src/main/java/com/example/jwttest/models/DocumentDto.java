package com.example.jwttest.models;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor

public class DocumentDto {
    private Long id;
    private String fileName;
    private User creator;
    private List<Comment> comments;
    private LocalDateTime createdAt;
    private boolean validated;
    private Set<ReviewerValidation> reviewersValidations;

    public DocumentDto(Document document) {
        this.id = document.getId();
        this.fileName=document.getFileName();
        this.creator=document.getCreator();
        this.comments=document.getComments();
        this.createdAt=document.getCreatedAt();
        this.validated=document.isValidated();
        this.reviewersValidations=document.getReviewersValidations();

    }
}
