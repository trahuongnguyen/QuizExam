package com.example.quizexam_student.service;

import com.example.quizexam_student.bean.request.QuestionRequest;
import com.example.quizexam_student.bean.response.QuestionResponse;
import com.example.quizexam_student.entity.Question;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public interface QuestionService {
    List<QuestionResponse> getAllQuestionsBySubjectId(int subjectId);
    Question saveQuestion(QuestionRequest questionRequest) throws IOException;
    Question updateQuestion(int id, QuestionRequest questionRequest) throws IOException;
}
