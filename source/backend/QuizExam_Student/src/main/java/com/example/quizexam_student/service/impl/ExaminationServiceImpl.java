package com.example.quizexam_student.service.impl;

import com.example.quizexam_student.bean.request.ExaminationRequest;
import com.example.quizexam_student.bean.response.ExaminationResponse;
import com.example.quizexam_student.bean.response.QuestionRecordResponse;
import com.example.quizexam_student.bean.response.QuestionResponse;
import com.example.quizexam_student.entity.*;
import com.example.quizexam_student.mapper.ExaminationMapper;
import com.example.quizexam_student.mapper.QuestionRecordMapper;
import com.example.quizexam_student.repository.*;
import com.example.quizexam_student.service.ExaminationService;
import com.example.quizexam_student.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExaminationServiceImpl implements ExaminationService {
    private final ExaminationRepository examinationRepository;
    private final QuestionRepository questionRepository;
    private final QuestionRecordRepository questionRecordRepository;
    private final AnswerRecordRepository answerRecordRepository;
    private final SubjectRepository subjectRepository;

    @Override
    public Examination saveExamination(ExaminationRequest examinationRequest) {
        List<Question> questions = questionRepository.findAllBySubjectAndStatus(subjectRepository.findById(examinationRequest.getSubjectId()).orElse(null),1);
        if (examinationRequest.getChapterIds()!=null){
            questions = questions.stream().filter(question ->
                    question.getChapters().stream().anyMatch(chapter ->
                            examinationRequest.getChapterIds().contains(chapter.getId())
                    )).toList();
        }
        Collections.shuffle(questions);
        AtomicInteger hardCount = new AtomicInteger(0);
        AtomicInteger easyCount = new AtomicInteger(0);
        List<Question> selectedQuestions = questions.stream()
                .filter(question -> {
                    if (question.getLevel().getId() == 2) {
                        return hardCount.get() < 4;
                    }
                    if (question.getLevel().getId() == 1) {
                        return easyCount.get() < 12;
                    }
                    return true;
                })
                .peek(question -> {
                    if (question.getLevel().getId() == 2) {
                        hardCount.getAndIncrement();
                    }
                    if (question.getLevel().getId() == 1) {
                        easyCount.getAndIncrement();
                    }
                }).limit(16)
                .collect(Collectors.toList());

        for (Question question : selectedQuestions) {
            AtomicInteger isCorrectCount = new AtomicInteger(0);
            AtomicInteger isIncorrectCount = new AtomicInteger(0);
            List<Answer> answers = new ArrayList<>(question.getAnswers());
            Collections.shuffle(answers);
            List<Answer> selectedAnswers = (List<Answer>) answers.stream()
                    .filter(answer -> {
                        if (answer.getIsCorrect() == 1){
                            return isCorrectCount.get() < 3;
                        }
                        return isIncorrectCount.get() < 3;
                    }).limit(4)
                    .peek(answer -> {
                        if (answer.getIsCorrect() == 1){
                            isCorrectCount.getAndIncrement();
                        }
                        if (answer.getIsCorrect() == 0){
                            isIncorrectCount.getAndIncrement();
                        }
                    }).collect(Collectors.toList());
            question.setAnswers(selectedAnswers.stream().collect(Collectors.toSet()));
        }
        Examination exam = ExaminationMapper.convertFromRequest(examinationRequest);
        exam.setStatus(1);
        exam.setQuestions(selectedQuestions.stream().collect(Collectors.toSet()));
        exam.setCode("HTML-001");
        exam.setSubject(subjectRepository.findById(examinationRequest.getSubjectId()).orElse(null));
        examinationRepository.save(exam);
        for (Question question : selectedQuestions) {
            QuestionRecord questionRecord = new QuestionRecord();
            questionRecord.setContent(question.getContent());
            List<Answer> answers = question.getAnswers().stream().toList();
            questionRecord.setOptionA(answers.get(0).getContent());
            questionRecord.setOptionB(answers.get(1).getContent());
            questionRecord.setOptionC(answers.get(2).getContent());
            questionRecord.setOptionD(answers.get(3).getContent());
            questionRecord.setExamination(exam);
            questionRecordRepository.save(questionRecord);
            for (Answer answer : answers) {
                AnswerRecord answerRecord = new AnswerRecord();
                if (answer.getIsCorrect() == 1){
                    answerRecord.setCorrectOption(answer.getContent());
                    answerRecord.setQuestionRecord(questionRecord);
                    answerRecordRepository.save(answerRecord);
                }
            }
        }
        return exam;
    }

    @Override
    public ExaminationResponse getDetailExamination(int examinationId) {
        Examination examination = examinationRepository.findById(examinationId).orElse(null);
        ExaminationResponse examinationResponse = ExaminationMapper.convertToResponse(examination);
        return setQuestionRecord(examinationResponse);
    }

    @Override
    public List<ExaminationResponse> getAllExaminations() {
        return examinationRepository.findAll().stream().map(ExaminationMapper::convertToResponse).map(examinationResponse -> setQuestionRecord(examinationResponse)).collect(Collectors.toList());
    }

    private ExaminationResponse setQuestionRecord(ExaminationResponse examinationResponse){
        examinationResponse.setQuestionRecordResponses(
                new ArrayList<>(questionRecordRepository.findAllByExamination(examinationRepository.findById(examinationResponse.getId()).orElse(null)))
                        .stream().map(QuestionRecordMapper::convertToResponse).map(questionRecordResponse -> {
                            questionRecordResponse.setAnswerRecords(answerRecordRepository.findAllByQuestionRecord(questionRecordRepository.findById(questionRecordResponse.getId()).orElse(null)));
                            return questionRecordResponse;
                        })
                        .collect(Collectors.toList()));
        return examinationResponse;
    }
}
