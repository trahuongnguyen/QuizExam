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
    private final LevelRepository levelRepository;

    @Override
    public Examination saveExamination(ExaminationRequest examinationRequest) {
        Subject subject = subjectRepository.findById(examinationRequest.getSubjectId()).orElse(null);
        Map<Integer, Integer> levelsRequest = examinationRequest.getLevels();
        int totalQuestions = 0;
        for (Map.Entry<Integer, Integer> entry : levelsRequest.entrySet()) {
            totalQuestions += entry.getValue();
        }
        Map<Integer, List<Question>> questionsByLevels = new HashMap<>();
        List<Question> allQuestions = questionRepository.findAllBySubjectAndStatusOrderByIdDesc(subject,1);

        levelsRequest.forEach((key, value) -> {
            List<Question> questionsByLevel = allQuestions.stream().filter(question -> question.getLevel().getId() == key).toList();
            if ((long) questionsByLevel.size() < value){
                throw new InvalidQuantityException("Question","Not enough questions");
            }
            questionsByLevels.put(key,questionsByLevel);
        });

        List<Examination> examinations = examinationRepository.findTop3BySubjectOrderByIdDesc(subject);
        Map<Integer, List<Question>> questionsByExams = new HashMap<>();
        examinations.forEach(examination -> {
            questionsByExams.put(examination.getId(), examination.getQuestions().stream().toList());
        });
        List<Question> finalQuestions = new ArrayList<>();
        int generatedCount = 0;
        do {
            generatedCount++;
            List<Question> selectedQuestion = generateQuestion(allQuestions, levelsRequest);
            if (!questionsByExams.isEmpty()){
                for (Map.Entry<Integer, List<Question>> entry : questionsByExams.entrySet()) {
                    allQuestions.removeAll(selectedQuestion);
                    selectedQuestion = checkDuplicatedQuestionInExamination(allQuestions, entry.getValue(), selectedQuestion);
                }
                finalQuestions.addAll(selectedQuestion);
            } else {
                allQuestions.removeAll(selectedQuestion);
                finalQuestions.addAll(selectedQuestion);
            }
            levelsRequest.entrySet().forEach(entry -> {
                int count = (int) finalQuestions.stream()
                        .filter(question -> question.getLevel().getId() == entry.getKey())
                        .count();
                entry.setValue(entry.getValue() - count);
            });
            if (finalQuestions.size()==totalQuestions){
                break;
            }
            if (generatedCount == 3){
                throw new InvalidQuantityException("Question","Not enough questions");
            }
        } while (true);

        int maxScore = 0;
        for (Question question : finalQuestions) {
            generateAnswerForQuestion(question);
            maxScore += question.getLevel().getPoint();
        }

        Examination exam = ExaminationMapper.convertFromRequest(examinationRequest);
        exam.setStatus(1);
        exam.setMaxScore(maxScore);
        exam.setQuestions(new HashSet<>(finalQuestions));
        exam.setSubject(subject);

        do {
            int randomNumber = random.nextInt(1000);
            String randomNumberStr = String.format("%03d",randomNumber);
            String currentDate = new SimpleDateFormat("yyMM").format(new Date());
            exam.setCode(allQuestions.get(0).getSubject().getName()+ "_" + randomNumberStr + "_" +currentDate);
        } while (examinationRepository.existsByCode(exam.getCode()));

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
    public List<ExaminationResponse> getAllExaminationsForStudent(List<Mark> marks) {
        List<Examination> examinations = new ArrayList<>();
        marks.forEach(mark -> {
            examinations.add(examinationRepository.findByMarksContainingAndStatus(mark, 1));
        });
        return examinations.stream().map(ExaminationMapper::convertToResponse).collect(Collectors.toList());
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
    public List<StudentDetail> updateStudentForExam(int examinationId, List<Integer> studentIds) {
        List<Mark> markList = markRepository.findAllByExaminationIdAndScoreAndBeginTime(examinationId, null, null);
        markList.stream().peek(mark -> {mark.setStudentDetail(null); mark.setExamination(null);}).toList();
        Examination examination = examinationRepository.findById(examinationId).orElse(null);
        markRepository.deleteAll(markList);
        studentIds.removeIf(studentId ->
                markRepository.findAllByStudentDetailAndScoreIsNullAndBeginTimeIsNotNull(studentRepository.findById(studentId).orElse(null)).size()==0
                );
        return studentRepository.findAllByUserIdIn(
                studentIds.stream().peek(studentId->{
                    Mark mark = new Mark();
                    mark.setExamination(examination);
                    mark.setStudentDetail(studentRepository.findById(studentId).orElse(null));
                    assert examination != null;
                    mark.setSubject(examination.getSubject());
                    markRepository.save(mark);
                }).toList()
        );
    }

    @Override
    public List<ExaminationResponse> getAllExamBySemId(int semId) {
        List<ExaminationResponse> exam = examinationRepository.findAllByStatus(1).stream()
                .map(ExaminationMapper::convertToResponse).collect(Collectors.toList());
        List<ExaminationResponse> examBySemId = exam.stream().filter(
                ex -> ex.getSubject().getSem().getId() == semId).collect(Collectors.toList());
        return examBySemId;
    }

    @Override
    public List<StudentResponse> getStudentsForExamination(int examinationId) {
        List<Mark> marks = markRepository.findAllByExaminationIdAndScoreAndBeginTime(examinationId, null, null);
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
        List<QuestionRecord> questionRecords = questionRecordRepository.findAllByExamination(examinationRepository.findById(examinationResponse.getId()).orElse(null));
        List<QuestionRecordResponse> questionRecordResponses = questionRecords.stream()
                .map(QuestionRecordMapper::convertToResponse)
                .collect(Collectors.toList());
        Collections.shuffle(questionRecordResponses);
        examinationResponse.setQuestionRecordResponses(questionRecordResponses);
        return examinationResponse;
    }

    private List<Question> generateQuestion(List<Question> questions, Map<Integer, Integer> levelsRequest) {
        Collections.shuffle(questions);
        int totalQuestions = 0;
        for (Map.Entry<Integer, Integer> entry : levelsRequest.entrySet()) {
            totalQuestions += entry.getValue();
        }
        Map<Integer, Integer> questionsCountByLevels = new HashMap<>();
        for (Map.Entry<Integer, Integer> levelEntry : levelsRequest.entrySet()) {
            questionsCountByLevels.put(levelEntry.getKey(), 0);
        }
        return questions.stream()
                .filter(question -> {
                    for (Map.Entry<Integer, Integer> entry : questionsCountByLevels.entrySet()) {
                        int levelValue = 0;
                        for (Map.Entry<Integer, Integer> levelEntry : levelsRequest.entrySet()) {
                            if(entry.getKey() == levelEntry.getKey()){
                                levelValue = levelEntry.getValue();
                                break;
                            }
                        }
                        if (question.getLevel().getId() == entry.getKey()){
                            return entry.getValue() < levelValue;
                        }
                    }
                    return true;
                })
                .peek(question -> {
                    for (Map.Entry<Integer, Integer> entry : questionsCountByLevels.entrySet()) {
                        if (question.getLevel().getId() == entry.getKey()){
                            entry.setValue(entry.getValue() + 1);
                        }
                    }
                }).limit(totalQuestions).collect(Collectors.toList());
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

    private List<Question> checkDuplicatedQuestionInExamination(List<Question> allQuestions, List<Question> questionsExisted, List<Question> questions){
        AtomicInteger duplicatedQuestions = new AtomicInteger(0);
        List<Integer> questionIds = questionsExisted.stream().map(Question::getId).toList();
        List<Question> questionsDuplicated = new ArrayList<>();
        List<Question> selectedQuestions = new ArrayList<>(questions.stream()
                .filter(question -> {
                    if (questionIds.contains(question.getId())) {
                        return duplicatedQuestions.get() < (int) questionsExisted.size()*0.3;
                    }
                    return true;
                }).peek(question -> {
                    if (questionIds.contains(question.getId())) {
                        questionsDuplicated.add(question);
                        duplicatedQuestions.getAndIncrement();
                    }
                }).toList());
        if(duplicatedQuestions.get() >= (int) (questionsExisted.size()*0.3)){
            allQuestions.removeAll(questions);
            questions.removeAll(questionsDuplicated);
        }
        return questions;
    }

    private void setAnswerForQuestion(Examination examination, Question question){
        int countCorrectAnswer = 0;
        QuestionRecord questionRecord = new QuestionRecord();
        questionRecord.setExamination(examination);
        questionRecord.setContent(question.getContent());
        questionRecord.setImage(question.getImage());
        questionRecord.setLevel(question.getLevel().getName());
        questionRecord.setPoint(question.getLevel().getPoint());

        List<Answer> answers = question.getAnswers().stream().toList();
        for (Answer answer : answers) {
            AnswerRecord answerRecord = new AnswerRecord();
            answerRecord.setContent(answer.getContent());
            answerRecord.setIsCorrect(answer.getIsCorrect());
            answerRecord.setQuestionRecord(questionRecord);
            if (answer.getIsCorrect() == 1){
                countCorrectAnswer++;
            }
            questionRecord.setType(countCorrectAnswer == 1 ? 1 : 2);
            answerRecordRepository.save(answerRecord);
        }
        questionRecordRepository.save(questionRecord);
    }
}
