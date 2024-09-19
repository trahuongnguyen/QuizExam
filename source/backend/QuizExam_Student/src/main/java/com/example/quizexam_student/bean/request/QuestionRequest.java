package com.example.quizexam_student.bean.request;

import lombok.Data;

import java.util.List;

@Data
public class QuestionRequest {
    private String content;
    private String image;
    private int subjectId;
    private List<Integer> chapters;
    private int levelId;
    private List<AnswerRequest> answers;
}
