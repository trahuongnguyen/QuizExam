package com.example.quizexam_student.service.impl;

import com.example.quizexam_student.bean.request.QuestionRequest;
import com.example.quizexam_student.bean.response.QuestionResponse;
import com.example.quizexam_student.entity.Answer;
import com.example.quizexam_student.entity.Question;
import com.example.quizexam_student.mapper.AnswerMapper;
import com.example.quizexam_student.mapper.QuestionMapper;
import com.example.quizexam_student.repository.*;
import com.example.quizexam_student.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {
    private final QuestionRepository questionRepository;
    private final SubjectRepository subjectRepository;
    private final LevelRepository levelRepository;
    private final ChapterRepository chapterRepository;
    private final AnswerRepository answerRepository;

    @Override
    public List<QuestionResponse> getAllQuestionsBySubjectId(int subjectId) {
        return questionRepository.findAllBySubject(subjectRepository.findById(subjectId).orElse(null)).stream().map(QuestionMapper::convertToResponse).collect(Collectors.toList());
    }

    @Override
    public Question saveQuestion(QuestionRequest questionRequest) {
        Question question = QuestionMapper.convertFromRequest(questionRequest);
        question.setSubject(subjectRepository.findById(questionRequest.getSubjectId()).orElse(null));
        question.setLevel(levelRepository.findById(questionRequest.getLevelId()).orElse(null));
        question.setChapters(chapterRepository.findByIdIn(questionRequest.getChapters()).stream().collect(Collectors.toSet()));
        questionRepository.saveAndFlush(question);
        List<Answer> answers = questionRequest.getAnswers().stream().map(AnswerMapper::convertFromRequest).collect(Collectors.toList());
        answers.stream().map(answer -> {answer.setQuestion(question); return answer;}).collect(Collectors.toList());
        answerRepository.saveAll(answers);
        return question;
    }
}
