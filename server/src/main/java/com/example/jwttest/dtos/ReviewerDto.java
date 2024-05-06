package com.example.jwttest.dtos;

import java.time.LocalDateTime;

import com.example.jwttest.models.Validation;

import lombok.Data;

@Data
public class ReviewerDto {
    private Long documentId;
    private String fileName;
    private LocalDateTime createdAt;
    private boolean validated;
    
    
    public ReviewerDto(Validation validation){
        this.documentId=validation.getDocument().getId();
        this.fileName=validation.getDocument().getFileName();
        this.createdAt=validation.getDocument().getCreatedAt();
        this.validated=validation.isValidated();
    }
    
}
