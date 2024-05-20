package com.example.jwttest.models;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.JoinColumn;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity @Data  @NoArgsConstructor @AllArgsConstructor 
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;



    @Column(nullable = false, columnDefinition = "boolean default false") 
    private boolean validated;


    @ManyToOne
    @JoinColumn(name = "creator_id") // Assuming the foreign key column name in the document table
    private User creator;

    private LocalDateTime createdAt; // Add createdAt attribute


    @OneToMany(mappedBy = "documentId", cascade = CascadeType.ALL)
    private List<Comment> comments= new ArrayList<>();

    /* @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "document_id") 
    private List<Comments> comments = new ArrayList<>(); */

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Validation> validations = new ArrayList<>();



    // Total number of reviewers required for validation
    private Integer totalReviewers=0;

    // Number of reviewers who have already validated the document
    private Integer totalValidations=0;

    private String type;
    private String note;



    public Document(String fileName,User creator){

        this.fileName=fileName;
        this.creator=creator;
        this.createdAt = LocalDateTime.now(); 
        
        
    }

    
}
