package com.example.jwttest.dtos;

import lombok.Data;

@Data
public class ReviewerStatisticsDto {
    private Long totalAssignedDocuments;
    private Long totalUploadedDocuments;

    public ReviewerStatisticsDto(Long totalAssignedDocuments,Long totalUploadedDocuments){
        this.totalAssignedDocuments=totalAssignedDocuments;
        this.totalUploadedDocuments=totalUploadedDocuments;
    }
    
}
