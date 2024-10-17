package com.example.quizexam_student.service.impl;

import com.example.quizexam_student.bean.request.ExaminationRequest;
import com.example.quizexam_student.bean.response.*;
import com.example.quizexam_student.entity.*;
import com.example.quizexam_student.exception.InvalidQuantityException;
import com.example.quizexam_student.mapper.*;
import com.example.quizexam_student.repository.*;
import com.example.quizexam_student.service.ExaminationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
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
    private final StudentRepository studentRepository;
    private final MarkRepository markRepository;
    private final Random random = new Random();
    private final UserRepository userRepository;

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
        long easyCountException = questions.stream()
                        .filter(q -> q.getLevel().getId() == 1).count();
        long hardCountException = questions.stream()
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
        List<Question> finalQuestions;
        int generatedCount = 0;
        do {
            boolean flag = true;
            finalQuestions = generateQuestion(questions);
            for (Examination examination: examinations){
                if (!checkDuplicatedQuestionInExamination(examination, finalQuestions)){
                    flag = false;
                    break;
                }
            }
            if (flag){
                break;
            }
            generatedCount++;
            if (generatedCount == 3){
                throw new InvalidQuantityException("Question","Not enough questions, please check the questions bank (Recommend: Questions bank has at least 70 questions for all chapters)");
            }
        } while (true);
        for (Question question : finalQuestions) {
            generateAnswerForQuestion(question);
        }
        Examination exam = ExaminationMapper.convertFromRequest(examinationRequest);
        exam.setStatus(1);
        exam.setQuestions(new HashSet<>(finalQuestions));
        do {
            int randomNumber = random.nextInt(1000);
            String randomNumberStr = String.format("%03d",randomNumber);
            String currentDate = new SimpleDateFormat("yyMM").format(new Date());
            exam.setCode(questions.get(0).getSubject().getName()+ "_" + randomNumberStr + "_" +currentDate);
        }while (examinationRepository.existsByCode(exam.getCode()));
        exam.setSubject(subjectRepository.findById(examinationRequest.getSubjectId()).orElse(null));
        for (Question question : finalQuestions) {
            setAnswerForQuestion(exam, question);
        }
        return examinationRepository.save(exam);
    }

    @Override
    public ExaminationResponse getDetailExamination(int examinationId) {
        Examination examination = examinationRepository.findById(examinationId).orElse(null);
        assert examination != null;
        ExaminationResponse examinationResponse = ExaminationMapper.convertToResponse(examination);
        return setQuestionRecord(examinationResponse);
    }

    @Override
    public List<ExaminationResponse> getAllExaminations() {
        return examinationRepository.findAll().stream().map(ExaminationMapper::convertToResponse).map(this::setQuestionRecord).collect(Collectors.toList());
    }

    @Override
    public Examination updateExamination(int examinationId, ExaminationRequest examinationRequest) {
        Examination examination = examinationRepository.findById(examinationId).orElse(null);
        assert examination != null;
        examination.setName(examinationRequest.getName());
        examination.setStartTime(examinationRequest.getStartTime());
        examination.setEndTime(examinationRequest.getEndTime());
        examination.setDuration(examinationRequest.getDuration());
        return examinationRepository.save(examination);
    }

    @Override
    public List<StudentDetail> updateStudentForExam(int examinationId, int subjectId, List<Integer> studentIds) {
        List<Mark> markList = markRepository.findAllByExaminationIdAndScore(examinationId, null);
        markList.stream().peek(mark -> {mark.setStudentDetail(null); mark.setExamination(null);}).toList();
        markRepository.deleteAll(markList);
        return studentRepository.findAllByUserIdIn(
                studentIds.stream().peek(studentId->{
                    Mark mark = new Mark();
                    mark.setExamination(examinationRepository.findById(examinationId).orElse(null));
                    mark.setStudentDetail(studentRepository.findById(studentId).orElse(null));
                    mark.setSubject(subjectRepository.findById(subjectId).orElse(null));
                    markRepository.save(mark);
                }).toList()
        );
    }

    @Override
    public ExaminationResponseNotIncludeQuestion getExaminationNotIncludeQuestion(int examinationId) {
        return ExaminationMapper.convertToResponseNotIncludeQuestion(ExaminationMapper.convertToResponse(Objects.requireNonNull(examinationRepository.findById(examinationId).orElse(null))));
    }

    @Override
    public List<StudentResponse> getStudentsForExamination(int examinationId) {
        List<Mark> marks = markRepository.findAllByExaminationIdAndScore(examinationId, null);
        return marks.stream().map(mark -> StudentMapper.convertToResponse(UserMapper.convertToResponse(Objects.requireNonNull(userRepository.findById(mark.getStudentDetail().getUserId()).orElse(null))), mark.getStudentDetail())).collect(Collectors.toList());
    }

    @Override
    public List<StudentDetail> getListStudentsToAddForExamination(int examinationId) {
        List<Mark> marks = markRepository.findAllByExaminationId(examinationId);
        List<Integer> studentDetailIds = marks.stream().map(mark -> StudentMapper.convertToResponse(UserMapper.convertToResponse(Objects.requireNonNull(userRepository.findById(mark.getStudentDetail().getUserId()).orElse(null))), mark.getStudentDetail())).map(StudentResponse::getUserResponse).map(UserResponse::getId).toList();
        List<StudentDetail> studentDetailList = studentRepository.findAll();
        studentDetailList.removeAll(studentRepository.findAllByUserIdIn(studentDetailIds));
        return studentDetailList;
    }

    private ExaminationResponse setQuestionRecord(ExaminationResponse examinationResponse){
        examinationResponse.setQuestionRecordResponses(
                new ArrayList<>(questionRecordRepository.findAllByExamination(examinationRepository.findById(examinationResponse.getId()).orElse(null)))
                        .stream().map(QuestionRecordMapper::convertToResponse)
                        .peek(questionRecordResponse -> questionRecordResponse.setAnswerRecords(answerRecordRepository.findAllByQuestionRecord(questionRecordRepository.findById(questionRecordResponse.getId()).orElse(null))))
                        .collect(Collectors.toList()));
        return examinationResponse;
    }

    private List<Question> generateQuestion(List<Question> questions) {
        Collections.shuffle(questions);
        AtomicInteger hardCount = new AtomicInteger(0);
        AtomicInteger easyCount = new AtomicInteger(0);
        return questions.stream()
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
    }

    public void generateAnswerForQuestion(Question question){
        AtomicInteger isCorrectCount = new AtomicInteger(0);
        AtomicInteger isIncorrectCount = new AtomicInteger(0);
        List<Answer> answers = new ArrayList<>(question.getAnswers());
        Collections.shuffle(answers);
        List<Answer> selectedAnswers = answers.stream()
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

    private boolean checkDuplicatedQuestionInExamination(Examination examination, List<Question> questions){
        AtomicInteger duplicatedQuestions = new AtomicInteger(0);
        List<Integer> questionIds = examination.getQuestions().stream().map(Question::getId).toList();
        List<Question> questionList = questions.stream()
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
        return questionList.size() >= 16;
    }

    private void setAnswerForQuestion(Examination examination, Question question){
        int countCorrectAnswer = 0;
        QuestionRecord questionRecord = new QuestionRecord();
        questionRecord.setContent(question.getContent());
        List<Answer> answers = question.getAnswers().stream().toList();
        questionRecord.setOptionA(answers.get(0).getContent());
        questionRecord.setOptionB(answers.get(1).getContent());
        questionRecord.setOptionC(answers.get(2).getContent());
        questionRecord.setOptionD(answers.get(3).getContent());
        questionRecord.setExamination(examination);
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
}
