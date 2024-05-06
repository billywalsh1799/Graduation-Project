package com.example.jwttest.dtos;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class CommentDto {
    private String author;
    private String content;
    private LocalDateTime createdAt;
    private Long documentId;
    
}
