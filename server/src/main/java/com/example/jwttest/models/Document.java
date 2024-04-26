package com.example.jwttest.models;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    @Lob
    private byte[] fileData;

    @ManyToMany
    @JoinTable(name = "document_reviewers",
               joinColumns = @JoinColumn(name = "document_id"),
               inverseJoinColumns = @JoinColumn(name = "user_id"))
    private List<User> reviewers;

    @ManyToOne
    @JoinColumn(name = "creator_id") // Assuming the foreign key column name in the document table
    private User creator;


    public Document(String fileName,byte[] fileData,List<User> reviewers,User creator){

        this.fileName=fileName;
        this.fileData=fileData;
        this.reviewers=reviewers;
        this.creator=creator;
    }


    
}
