package com.example.jwttest.dtos;

import java.time.LocalDateTime;

import com.example.jwttest.models.Document;
import com.example.jwttest.models.Validation;

import lombok.Data;

@Data
public class ReviewerDto {
    private Long documentId;
    private String fileName;
    private LocalDateTime createdAt;
    private boolean validated;
    private String type;
    
    
    public ReviewerDto(Validation validation){
        Document document=validation.getDocument();
        this.documentId=document.getId();
        this.fileName=document.getFileName();
        this.createdAt=document.getCreatedAt();
        this.validated=validation.isValidated();
        this.type=document.getType();
    }
    
}
