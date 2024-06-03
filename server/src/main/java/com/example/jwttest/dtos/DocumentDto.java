package com.example.jwttest.dtos;
import java.util.List;
import com.example.jwttest.models.Comment;
import com.example.jwttest.models.Document;

import lombok.Data;

@Data

public class DocumentDto {
    private Long id;
    private String fileName;
    private String creator;
    private List<Comment> comments;
    private boolean validated=false;


    public DocumentDto(Document document,boolean reviewerValidation) {
        this.id = document.getId();
        this.fileName=document.getFileName();
        this.creator=document.getCreator().getUsername();
        this.comments=document.getComments();
        this.validated=reviewerValidation;

        
        

    }
}
