package com.example.quizexam_student.service.impl;

import com.example.quizexam_student.bean.request.QuestionRequest;
import com.example.quizexam_student.bean.response.QuestionResponse;
import com.example.quizexam_student.entity.Answer;
import com.example.quizexam_student.entity.Chapter;
import com.example.quizexam_student.entity.Question;
import com.example.quizexam_student.exception.NotFoundException;
import com.example.quizexam_student.mapper.AnswerMapper;
import com.example.quizexam_student.mapper.QuestionMapper;
import com.example.quizexam_student.repository.*;
import com.example.quizexam_student.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
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
        return questionRepository.findAllBySubjectAndStatus(subjectRepository.findById(subjectId).orElse(null), 1).stream().map(question -> {
            List<Question> questionList = new ArrayList<>();
            questionList.add(question);
            List<Chapter> chapters = chapterRepository.findByQuestionsIn(questionList);
            List<Answer> answers = answerRepository.findByQuestion(question);

            QuestionResponse questionResponse = QuestionMapper.convertToResponse(question);
            questionResponse.setChapters(chapters.stream().collect(Collectors.toList()));
            questionResponse.setAnswers(answers.stream().collect(Collectors.toList()));
            return questionResponse;
        }).collect(Collectors.toList());
    }

    @Override
    public QuestionResponse getQuestionById(int questionId) {
        Question question = questionRepository.findByIdAndStatus(questionId, 1);
        if (Objects.isNull(question) || question.getStatus() == 0) {
            throw new NotFoundException("question", "Question not found.");
        }
        List<Question> questionList = new ArrayList<>();
        questionList.add(question);
        List<Chapter> chapters = chapterRepository.findByQuestionsIn(questionList);
        List<Answer> answers = answerRepository.findByQuestion(question);

        QuestionResponse questionResponse = QuestionMapper.convertToResponse(question);
        questionResponse.setChapters(chapters.stream().collect(Collectors.toList()));
        questionResponse.setAnswers(answers.stream().collect(Collectors.toList()));
        return questionResponse;
    }

    @Override
    public List<Question> saveQuestions(List<QuestionRequest> questionRequests) throws IOException {
        List<Question> savedQuestions = new ArrayList<>();
        for (QuestionRequest questionRequest : questionRequests) {
            Question question = QuestionMapper.convertFromRequest(questionRequest);
            question.setStatus(1);
            question.setSubject(subjectRepository.findById(questionRequest.getSubjectId()).orElse(null));
            question.setLevel(levelRepository.findById(questionRequest.getLevelId()).orElse(null));
            question.setChapters(chapterRepository.findByIdIn(questionRequest.getChapters()).stream().collect(Collectors.toSet()));
            questionRepository.save(question);
            List<Answer> answers = questionRequest.getAnswers().stream().map(AnswerMapper::convertFromRequest).collect(Collectors.toList());
            answers.stream().map(answer -> {answer.setQuestion(question); return answer;}).collect(Collectors.toList());
            answerRepository.saveAll(answers);
            savedQuestions.add(question);
        }
        return savedQuestions;
    }

    @Override
    public Question updateQuestion(int id, QuestionRequest questionRequest) throws IOException {
        Question question = questionRepository.findById(id).orElse(null);
        question.setContent(questionRequest.getContent());
        question.setImage(questionRequest.getImage());
        question.setSubject(subjectRepository.findById(questionRequest.getSubjectId()).orElse(null));
        question.setLevel(levelRepository.findById(questionRequest.getLevelId()).orElse(null));
        question.setChapters(chapterRepository.findByIdIn(questionRequest.getChapters()).stream().collect(Collectors.toSet()));
        question.setAnswers(new HashSet<>());
        questionRepository.save(question);
        List<Answer> answers = questionRequest.getAnswers().stream().map(AnswerMapper::convertFromRequest).collect(Collectors.toList());
        answers.stream().map(answer -> {answer.setQuestion(question); return answer;}).collect(Collectors.toList());
        answerRepository.deleteAll(answerRepository.findByQuestion(question).stream().map(answer -> {answer.setQuestion(null); return answer;}).collect(Collectors.toList()));
        answerRepository.saveAll(answers);
        return question;
    }
}
