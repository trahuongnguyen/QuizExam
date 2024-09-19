package com.example.quizexam_student.service.impl;

import com.example.quizexam_student.bean.request.AnswerRequest;
import com.example.quizexam_student.entity.Answer;
import com.example.quizexam_student.mapper.AnswerMapper;
import com.example.quizexam_student.repository.AnswerRepository;
import com.example.quizexam_student.repository.QuestionRepository;
import com.example.quizexam_student.service.AnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnswerServiceImpl implements AnswerService {
    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;

    @Override
    public List<Answer> getAnswersByQuestionId(int questionId) {
        return answerRepository.findByQuestion(questionRepository.findById(questionId).orElse(null));
    }
}
