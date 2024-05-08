package com.example.jwttest.dtos;

import com.example.jwttest.models.Validation;

import lombok.Data;

@Data
public class ValidationDto {
    private Long documentId;
    private String fileName;
    private String reviewerEmail;
    private boolean validated;

    public ValidationDto(Validation validation){
        this.documentId=validation.getDocument().getId();
        this.fileName=validation.getDocument().getFileName();
        this.reviewerEmail=validation.getReviewer().getEmail();
        this.validated=validation.isValidated();
    }
    
    
}
