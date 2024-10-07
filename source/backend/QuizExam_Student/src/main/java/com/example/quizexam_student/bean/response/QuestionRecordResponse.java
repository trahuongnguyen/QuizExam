package com.example.quizexam_student.bean.response;

import com.example.quizexam_student.entity.AnswerRecord;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.util.List;

@Data
public class QuestionRecordResponse {
    private int id;
    private String content;
    private String image;
    private Integer type;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    @JsonIgnore
    private List<AnswerRecord> answerRecords;

    // them image, type sau
}
