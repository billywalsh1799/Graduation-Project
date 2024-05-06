package com.example.jwttest.dtos;

import java.time.LocalDateTime;

import com.example.jwttest.models.Document;

import lombok.Data;

@Data
public class CreatorDto {
    private Long documentId;
    private String fileName;
    private LocalDateTime createdAt;
    private float validationProgress;
    
    public CreatorDto(Document document){
        this.documentId=document.getId();
        this.fileName=document.getFileName();
        this.createdAt=document.getCreatedAt();
        this.validationProgress=(document.getTotalValidations()*100)/document.getTotalReviewers();
       
    }
    
}
