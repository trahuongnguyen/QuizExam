package com.example.quizexam_student.service.impl;

import com.example.quizexam_student.bean.request.ExaminationRequest;
import com.example.quizexam_student.bean.response.ExaminationResponse;
import com.example.quizexam_student.entity.*;
import com.example.quizexam_student.exception.EmptyException;
import com.example.quizexam_student.exception.InvalidQuantityException;
import com.example.quizexam_student.mapper.ExaminationMapper;
import com.example.quizexam_student.mapper.QuestionRecordMapper;
import com.example.quizexam_student.repository.*;
import com.example.quizexam_student.service.ExaminationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExaminationServiceImpl implements ExaminationService {
    private final ExaminationRepository examinationRepository;
    private final QuestionRepository questionRepository;
    private final QuestionRecordRepository questionRecordRepository;
    private final AnswerRecordRepository answerRecordRepository;
    private final SubjectRepository subjectRepository;
    private final StudentRepository studentRepository;
    private final MarkRepository markRepository;
    private final ClassesRepository classesRepository;

    @Override
    public Examination saveExamination(ExaminationRequest examinationRequest) {
        List<Question> questions = questionRepository.findAllBySubjectAndStatus(subjectRepository.findById(examinationRequest.getSubjectId()).orElse(null),1);
        if (examinationRequest.getChapterIds()!=null && !examinationRequest.getChapterIds().isEmpty()){

                questions = questions.stream().filter(question ->
                        question.getChapters().stream().anyMatch(chapter ->
                                examinationRequest.getChapterIds().contains(chapter.getId())
                        )).toList();

        } else{
            questions = questions.stream().filter(question ->
                    question.getChapters().isEmpty()).toList();
        }
        if (examinationRequest.getStudentIds().isEmpty() && examinationRequest.getClassesIds().isEmpty()){
            throw new EmptyException("Student, Class", "Student and Class can not be empty together");
        }
        List<StudentDetail> studentList = new ArrayList<>();
        if (examinationRequest.getClassesIds() != null){
            studentList = studentRepository.findAllBy_classIn(classesRepository.findAllById(examinationRequest.getClassesIds()));
        }
        if (examinationRequest.getStudentIds() != null){
            studentList = studentRepository.findAllByUserIdIn(examinationRequest.getStudentIds());
        }
        Long easyCountException = questions.stream()
                        .filter(q -> q.getLevel().getId() == 1).count();
        Long hardCountException = questions.stream()
                        .filter(q -> q.getLevel().getId() == 2).count();
        if (easyCountException < 12){
            throw new InvalidQuantityException("EasyQuestion","Not enough easy questions (at least 12 are required)");
        }
        if (hardCountException < 4){
            throw new InvalidQuantityException("HardQuestion","Not enough hard questions (at least 4 are required)");
        }

        if (questions.size()<16){
            throw new InvalidQuantityException("Question","Not enough questions");
        }

        List<Examination> examinations = examinationRepository.findAllByOrderByIdDesc().stream().limit(3).toList();
        questions = new ArrayList<>(questions);
        Collections.shuffle(questions);
        List<Question> finalQuestions = questions;
        int generatedCount = 0;
        do {
            generatedCount++;
            boolean flag = true;
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
                    }).limit(16).collect(Collectors.toList());
            finalQuestions = selectedQuestions;
            for (Examination examination: examinations){
                AtomicInteger duplicatedQuestions = new AtomicInteger(0);
                List<Integer> questionIds = examination.getQuestions().stream().map(Question::getId).toList();
                List<Question> questionList = selectedQuestions.stream()
                        .filter(question -> {
                            if (questionIds.contains(question.getId())) {
                                return duplicatedQuestions.get() < 5;
                            }
                            return true;
                        }).peek(question -> {
                            if (questionIds.contains(question.getId())) {
                                duplicatedQuestions.getAndIncrement();
                            }
                        }).toList();
                System.out.println(questionList.size());
                System.out.println("aaaaaaaaa");
                if (questionList.size()<16){
                    flag = false;
                    break;
                    //throw new InvalidQuantityException("Question","Not enough questions, please check the questions bank");
                }
            }
            if (flag){
                break;
            }
            if (generatedCount == 3){
                throw new InvalidQuantityException("Question","Not enough questions, please check the questions bank");
            }
        } while (true);
        for (Question question : finalQuestions) {
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
                    }).toList();
            question.setAnswers(new HashSet<>(selectedAnswers));
        }
        Examination exam = ExaminationMapper.convertFromRequest(examinationRequest);
        exam.setStatus(1);
        exam.setQuestions(new HashSet<>(finalQuestions));
        exam.setCode("HTML-001");
        exam.setSubject(subjectRepository.findById(examinationRequest.getSubjectId()).orElse(null));
        examinationRepository.save(exam);
        for (Question question : finalQuestions) {
            int countCorrectAnswer = 0;
            QuestionRecord questionRecord = new QuestionRecord();
            questionRecord.setContent(question.getContent());
            List<Answer> answers = question.getAnswers().stream().toList();
            questionRecord.setOptionA(answers.get(0).getContent());
            questionRecord.setOptionB(answers.get(1).getContent());
            questionRecord.setOptionC(answers.get(2).getContent());
            questionRecord.setOptionD(answers.get(3).getContent());
            questionRecord.setExamination(exam);
            for (Answer answer : answers) {
                AnswerRecord answerRecord = new AnswerRecord();
                if (answer.getIsCorrect() == 1){
                    countCorrectAnswer++;
                    questionRecord.setType(countCorrectAnswer == 1 ? 1 : 2);
                    answerRecord.setCorrectOption(answer.getContent());
                    answerRecord.setQuestionRecord(questionRecord);
                    answerRecordRepository.save(answerRecord);

                }
            }
            questionRecordRepository.save(questionRecord);
        }
        for (StudentDetail studentDetail : studentList) {
            Mark mark = new Mark();
            mark.setSubject(subjectRepository.findById(examinationRequest.getSubjectId()).orElse(null));
            mark.setStudentDetail(studentDetail);
            mark.setExamination(exam);
            markRepository.save(mark);
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

    @Override
    public Examination updateExamination(int examinationId, ExaminationRequest examinationRequest) {
        Examination examination = examinationRepository.findById(examinationId).orElse(null);
        examination.setName(examinationRequest.getName());
        examination.setStartTime(examinationRequest.getStartTime());
        examination.setEndTime(examinationRequest.getEndTime());
        examination.setDuration(examinationRequest.getDuration());
        return examinationRepository.save(examination);
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
