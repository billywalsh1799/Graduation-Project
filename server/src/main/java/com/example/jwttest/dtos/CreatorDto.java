package com.example.jwttest.dtos;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.example.jwttest.models.Document;

import lombok.Data;

@Data
public class CreatorDto {
    private Long documentId;
    private String fileName;
    private LocalDateTime createdAt;
    private float validationProgress;
    private String uploader;
    private String type;
    private List<ValidationDto> validations;
    
    public CreatorDto(Document document){
        this.documentId=document.getId();
        this.fileName=document.getFileName();
        this.createdAt=document.getCreatedAt();
        this.validationProgress=(document.getTotalValidations()*100)/document.getTotalReviewers();
        this.uploader=document.getCreator().getUsername();
        this.type=document.getType();
        this.validations=document.getValidations().stream()
                                                .map(ValidationDto::new)
                                                .collect(Collectors.toList());
       
    }
    
}
