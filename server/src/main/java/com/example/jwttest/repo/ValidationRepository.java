package com.example.jwttest.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.jwttest.models.Validation;

public interface ValidationRepository extends JpaRepository <Validation,Long> {
    List<Validation> findByReviewerId(Long reviewerId);
    Optional<Validation> findByReviewerIdAndDocumentId(Long reviewerId, Long documentId);
}
