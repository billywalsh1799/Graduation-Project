package com.example.jwttest.models;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class CommentDto {
    private String author;
    private String content;
    private LocalDateTime createdAt;
    private Long documentId;
    
}
