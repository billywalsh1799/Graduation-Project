package com.example.jwttest.services;


import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.jwttest.models.Document;
import com.example.jwttest.models.User;
import com.example.jwttest.repo.DocumentRepository;
import com.example.jwttest.repo.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    public Document createDocument(MultipartFile file, List<String> reviewerEmails)  {
        Document document = new Document();
        document.setFileName(file.getOriginalFilename());
        try {
            document.setFileData(file.getBytes());
        } catch (IOException e) {
            // TODO Auto-generated catch block
            System.err.println("error uploading");
            e.printStackTrace();
        }
        List<User> reviewers = userRepository.findAllByEmailIn(reviewerEmails);
        document.setReviewers(reviewers);
        return documentRepository.save(document);
    }

    public Document getDocumentById(Long documentId) {
        Document document=documentRepository.findById(documentId).orElseThrow(()->new RuntimeException("document not found"));
        return document;
    }
}