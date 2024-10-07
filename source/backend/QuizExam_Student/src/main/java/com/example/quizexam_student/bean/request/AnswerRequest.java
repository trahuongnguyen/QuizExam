package com.example.quizexam_student.bean.request;

import com.example.quizexam_student.entity.Question;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AnswerRequest {
    @NotBlank(message = "Content Answer is required")
    private String content;

    private int isCorrect;
}
