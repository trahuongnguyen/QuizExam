package com.example.quizexam_student.bean.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
@Data
public class ExaminationResponse {
    private int id;
    private String name;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer duration;
    private String code;
    private List<QuestionRecordResponse> questionRecordResponses;
}
