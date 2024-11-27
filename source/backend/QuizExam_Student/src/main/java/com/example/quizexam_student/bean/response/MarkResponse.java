package com.example.quizexam_student.bean.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MarkResponse {
    private int id;
    private Double score;
    private LocalDateTime beginTime;
    private LocalDateTime submittedTime;
    private Double maxScore;
    private Integer warning;
    private String subjectName;
}
