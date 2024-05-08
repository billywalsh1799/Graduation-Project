package com.example.jwttest.dtos;

import lombok.Data;

@Data
public class DocumentValidationRequest {
    private Long documentId;
    private String reviewerEmail;
    
}
