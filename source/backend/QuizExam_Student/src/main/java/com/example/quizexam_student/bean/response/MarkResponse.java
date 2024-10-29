package com.example.quizexam_student.bean.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MarkResponse {
    private int id;
    private Integer score;
    private LocalDateTime beginTime;
    private LocalDateTime submittedTime;
    private Integer maxScore;
    private Integer warning;
    private String subjectName;
}
