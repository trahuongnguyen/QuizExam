package com.example.quizexam_student.service.impl;

import com.example.quizexam_student.bean.request.QuestionRequest;
import com.example.quizexam_student.bean.response.QuestionResponse;
import com.example.quizexam_student.entity.*;
import com.example.quizexam_student.exception.*;
import com.example.quizexam_student.mapper.*;
import com.example.quizexam_student.repository.*;
import com.example.quizexam_student.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
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
        return questionRepository.findAllBySubjectAndStatusOrderByIdDesc(subjectRepository.findById(subjectId).orElse(null), 1).stream().map(QuestionMapper::convertToResponse).collect(Collectors.toList());
    }

    @Override
    public QuestionResponse getQuestionById(int questionId) {
        Question question = questionRepository.findByIdAndStatus(questionId, 1);
        if (Objects.isNull(question) || question.getStatus() == 0) {
            throw new NotFoundException("question", "Question not found.");
        }
        return QuestionMapper.convertToResponse(question);
    }

    @Override
    public List<Question> saveQuestions(List<QuestionRequest> questionRequests){
        List<Question> savedQuestions = new ArrayList<>();
        for (QuestionRequest questionRequest : questionRequests) {
            Question question = QuestionMapper.convertFromRequest(questionRequest);
            question.setStatus(1);
            question.setSubject(subjectRepository.findById(questionRequest.getSubjectId()).orElse(null));
            question.setLevel(levelRepository.findById(questionRequest.getLevelId()).orElse(null));
            question.setChapters(new HashSet<>(chapterRepository.findByIdIn(questionRequest.getChapters())));
            List<Answer> answers = questionRequest.getAnswers().stream().map(AnswerMapper::convertFromRequest).toList();
            question.setAnswers(new HashSet<>(answers.stream().peek(answer -> answer.setQuestion(question)).toList()));
            questionRepository.save(question);
            savedQuestions.add(question);
        }
        return savedQuestions;
    }

    @Override
    public Question updateQuestion(int id, QuestionRequest questionRequest){
        Question question = questionRepository.findById(id).orElse(null);
        assert question != null;
        question.setContent(questionRequest.getContent());
        if (questionRequest.getImage() != null) {
            question.setImage(questionRequest.getImage().isEmpty() ? null : questionRequest.getImage());
        }
        question.setSubject(subjectRepository.findById(questionRequest.getSubjectId()).orElse(null));
        question.setLevel(levelRepository.findById(questionRequest.getLevelId()).orElse(null));
        question.setChapters(new HashSet<>(chapterRepository.findByIdIn(questionRequest.getChapters())));
        List<Answer> answers = questionRequest.getAnswers().stream().map(AnswerMapper::convertFromRequest).collect(Collectors.toList());
        answers = answers.stream().peek(answer -> answer.setQuestion(question)).collect(Collectors.toList());

        if (answers.size() < 4) {
            throw new InvalidQuantityException("question", "Must have at least 4 answers.");
        }

        boolean hasCorrectAnswer = answers.stream().anyMatch(answer -> answer.getIsCorrect() == 1);
        boolean hasIncorrectAnswer = answers.stream().anyMatch(answer -> answer.getIsCorrect() == 0);
        if (!hasCorrectAnswer || !hasIncorrectAnswer) {
            throw new NotFoundException("question", "Must have at least one correct answer and one incorrect answer.");
        }

        question.setAnswers(new HashSet<>());
        questionRepository.save(question);
        List<Answer> questionAnswers = answerRepository.findByQuestion(question);
        answerRepository.deleteAll(questionAnswers.stream().peek(answer -> answer.setQuestion(null)).toList());
        answerRepository.saveAll(answers);
        return question;
    }

    @Override
    public Question deleteQuestion(int questionId) {
        Question question = questionRepository.findByIdAndStatus(questionId, 1);
        if (Objects.isNull(question) || question.getStatus() == 0) {
            throw new NotFoundException("question", "Question not found.");
        }
        question.setStatus(0);
        return questionRepository.save(question);
    }
}
