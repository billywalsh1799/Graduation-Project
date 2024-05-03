package com.example.jwttest.models;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor

public class DocumentDto {
    private Long id;
    private String fileName;
    private Map<String, Boolean> validationStatus;
    private User creator;
    private List<Comment> comments;
    private LocalDateTime createdAt;
    private boolean validated;

    public DocumentDto(Document document) {
        this.id = document.getId();
        this.fileName=document.getFileName();
        this.validationStatus=document.getValidationStatus();
        this.creator=document.getCreator();
        this.comments=document.getComments();
        this.createdAt=document.getCreatedAt();
        this.validated=document.isValidated();

    }
}
