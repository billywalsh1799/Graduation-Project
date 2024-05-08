package com.example.jwttest.models;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity @Data  @NoArgsConstructor @AllArgsConstructor
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;
    private String author;
    private LocalDateTime createdAt;

    @Column(name = "document_id")
    private Long documentId;

    /* @ManyToOne
    @JoinColumn(name = "document_id")
    private Document document; */


    public Comment(String author,String content,LocalDateTime createdAt,Long documentId){
        this.author=author;
        this.content=content;
        this.createdAt=createdAt;
        this.documentId=documentId;

    }
    
}
