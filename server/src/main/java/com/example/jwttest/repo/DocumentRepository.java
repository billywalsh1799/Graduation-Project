package com.example.jwttest.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.jwttest.models.Document;
import com.example.jwttest.models.DocumentDto;

public interface DocumentRepository extends JpaRepository<Document,Long> {
    Optional<Document> findById(Long id);
    List<Document> findAll();

    // Query to retrieve documents for review by a specific reviewer
    @Query("SELECT d FROM Document d LEFT JOIN FETCH d.validationStatus v WHERE KEY(v) = :reviewerEmail")
    List<DocumentDto> findByReviewerEmail(@Param("reviewerEmail") String reviewerEmail);
      // Query to retrieve documents for review by a specific reviewer
      /* @Query("SELECT new Document(d.id, d.fileName, d.validated, d.validationStatus, d.creator, d.createdAt, d.comments) FROM Document d LEFT JOIN d.validationStatus v WHERE KEY(v) = :reviewerEmail")
      List<Document> findByReviewerEmail(@Param("reviewerEmail") String reviewerEmail); */
    

    
}
