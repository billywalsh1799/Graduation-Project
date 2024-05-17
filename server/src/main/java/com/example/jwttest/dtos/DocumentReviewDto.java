package com.example.jwttest.dtos;

import java.time.LocalDateTime;
import java.util.List;

import com.example.jwttest.models.Comment;
import com.example.jwttest.models.Document;
import com.example.jwttest.models.Validation;

import lombok.Data;

@Data
public class DocumentReviewDto {
    private Long documentId;
    private String fileName;
    private String creator;
    private LocalDateTime createdAt;
    private List<Comment> comments;
    private boolean validated;

    public DocumentReviewDto(Validation validation){
        Document document=validation.getDocument();
        this.documentId=document.getId();
        this.fileName=document.getFileName();
        this.creator=document.getCreator().getUsername();
        this.createdAt=document.getCreatedAt();
        this.validated=validation.isValidated();
    }
    
}
