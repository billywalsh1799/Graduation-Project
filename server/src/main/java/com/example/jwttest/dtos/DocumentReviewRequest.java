package com.example.jwttest.dtos;

import lombok.Data;

@Data
public class DocumentReviewRequest {
    private Long documentId;
    private Long reviewerId;
    
}
