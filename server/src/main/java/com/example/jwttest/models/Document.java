package com.example.jwttest.models;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.hibernate.annotations.Type;

import jakarta.persistence.Basic;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.JoinColumn;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity @Data  @NoArgsConstructor @AllArgsConstructor @Builder
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;


    @Column(nullable = false, columnDefinition = "boolean default false") 
    private boolean validated;

    

    @Lob
    private byte[] fileData;

    /* @ManyToMany
    @JoinTable(name = "document_reviewers",
               joinColumns = @JoinColumn(name = "document_id"),
               inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<User> reviewers; */

    @ElementCollection
    @MapKeyColumn(name = "reviewer_email") // Use email as the map key
    @Column(name = "is_validated")
    private Map<String, Boolean> validationStatus;

    @ManyToOne
    @JoinColumn(name = "creator_id") // Assuming the foreign key column name in the document table
    private User creator;

    private LocalDateTime createdAt; // Add createdAt attribute


    @OneToMany(mappedBy = "documentId", cascade = CascadeType.ALL)
    private List<Comment> comments;


    public Document(String fileName,byte[] fileData,Map<String, Boolean> validationStatus,User creator){

        this.fileName=fileName;
        this.fileData=fileData;
        this.creator=creator;
        this.createdAt = LocalDateTime.now(); // Initialize createdAt with current timestamp
        this.comments = new ArrayList<>();
        this.validationStatus=validationStatus;
        
       
    }

    public Document(Long id, String fileName, boolean validated, Map<String, Boolean> validationStatus, User creator, LocalDateTime createdAt, List<Comment> comments) {
        this.id = id;
        this.fileName = fileName;
        this.validated = validated;
        this.validationStatus = validationStatus;
        this.creator = creator;
        this.createdAt = createdAt;
        this.comments = comments;
    }


    
}
