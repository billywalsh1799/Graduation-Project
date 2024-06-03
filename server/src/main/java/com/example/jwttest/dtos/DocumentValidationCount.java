package com.example.jwttest.dtos;

import java.util.List;

import lombok.Data;

@Data
public class DocumentValidationCount {

    private List<String> categories;
    private List<Long> done ;
    private List<Long> inprogress ;

    public DocumentValidationCount(List<String> categories,List<Long> done,List<Long> inprogress){
        this.categories=categories;
        this.done=done;
        this.inprogress=inprogress;
    }
    
}
