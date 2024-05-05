package com.example.jwttest.models;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

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


    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "document_id")
    private Set<ReviewerValidation> reviewersValidations= new HashSet<>();


    public Document(String fileName,User creator){

        this.fileName=fileName;
        this.creator=creator;
        this.createdAt = LocalDateTime.now(); // Initialize createdAt with current timestamp
        
    }

    public void addReviewerValidation(ReviewerValidation validation){
        this.reviewersValidations.add(validation);

    }

    


    
}
