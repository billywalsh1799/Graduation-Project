package com.example.jwttest.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.jwttest.models.Comment;

public interface CommentRepository extends JpaRepository<Comment,Long> {
    List<Comment> findAll();
    
}
