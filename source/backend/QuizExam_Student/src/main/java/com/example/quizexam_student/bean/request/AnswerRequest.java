package com.example.quizexam_student.bean.request;

import com.example.quizexam_student.entity.Question;
import lombok.Data;

@Data
public class AnswerRequest {
    private String content;
    private int isCorrect;
}
