package com.example.quizexam_student.mapper;

import com.example.quizexam_student.bean.request.QuestionRequest;
import com.example.quizexam_student.bean.response.QuestionResponse;
import com.example.quizexam_student.entity.Question;

import java.util.stream.Collectors;

public class QuestionMapper {
    public static Question convertFromRequest(QuestionRequest questionRequest) {
        Question question = new Question();
        question.setContent(questionRequest.getContent());
        question.setImage(questionRequest.getImage());
        //question.setAnswers(questionRequest.getAnswers().stream().map(AnswerMapper::convertFromRequest).collect(Collectors.toSet()));
        return question;
    }

    public static QuestionResponse convertToResponse(Question question) {
        QuestionResponse questionResponse = new QuestionResponse();
        questionResponse.setId(question.getId());
        questionResponse.setContent(question.getContent());
        questionResponse.setImage(question.getImage());
        questionResponse.setSubject(question.getSubject());
        questionResponse.setLevel(question.getLevel());
        return questionResponse;
    }
}
