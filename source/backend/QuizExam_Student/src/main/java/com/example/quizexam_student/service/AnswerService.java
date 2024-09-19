package com.example.quizexam_student.service;

import com.example.quizexam_student.bean.request.AnswerRequest;
import com.example.quizexam_student.entity.Answer;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AnswerService {
    List<Answer> getAnswersByQuestionId(int questionId);
}
