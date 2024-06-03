package com.example.jwttest.repo;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.example.jwttest.models.Document;
import com.example.jwttest.models.User;

public interface DocumentRepository extends JpaRepository<Document,Long> {
    Optional<Document> findById(Long id);
    List<Document> findAll();
    List<Document> findByCreatorId(Long creatorId);

    @Query("SELECT DISTINCT d.creator FROM Document d")
    List<User> findAllCreators();

    long countByCreatorId(Long creatorId);

    @Query("SELECT d.type, COUNT(d) FROM Document d GROUP BY d.type")
    List<Object[]> countDocumentsByType();

    @Query("SELECT d.type, " +
    "SUM(CASE WHEN d.validated = true THEN 1 ELSE 0 END) AS validatedCount, " +
    "SUM(CASE WHEN d.validated = false THEN 1 ELSE 0 END) AS unvalidatedCount " +
    "FROM Document d " +
    "GROUP BY d.type")
    List<Object[]> getDocumentValidationCountsByType();
    
}
