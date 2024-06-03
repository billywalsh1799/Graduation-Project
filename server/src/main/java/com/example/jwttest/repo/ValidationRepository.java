package com.example.jwttest.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.jwttest.models.User;
import com.example.jwttest.models.Validation;

public interface ValidationRepository extends JpaRepository <Validation,Long> {
    List<Validation> findByReviewerId(Long reviewerId);
    List<Validation> findByReviewerEmail(String email);
    List<Validation> findByDocumentId(Long documentId);
    Optional<Validation> findByReviewerIdAndDocumentId(Long reviewerId, Long documentId);
    Optional<Validation> findByReviewerEmailAndDocumentId(String email, Long documentId);

    @Query("SELECT DISTINCT v.reviewer FROM Validation v")
    List<User> findAllReviewers();

    long countByReviewerId(Long reviewerId);
}
