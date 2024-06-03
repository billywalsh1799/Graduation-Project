package com.example.jwttest.dtos;

import lombok.Data;

@Data
public class DocumentTypeCount {
    private String name;
    private Double y;
    public DocumentTypeCount(String name, Double y) {
        this.name = name;
        this.y = y;
    }

    
}
