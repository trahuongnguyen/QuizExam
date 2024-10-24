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
        List<Question> allQuestions = questionRepository.findAllBySubjectAndStatus(subject,1);

        levelsRequest.forEach((key, value) -> {
            List<Question> questionsByLevel = allQuestions.stream().filter(question -> question.getLevel().getId() == key).toList();
            if ((long) questionsByLevel.size() < value){
                throw new InvalidQuantityException("Question","Not enough questions");
            }
            questionsByLevels.put(key,questionsByLevel);
        });

        List<Examination> examinations = examinationRepository.findAllBySubjectOrderByIdDesc(subject).stream().limit(3).toList();
        Map<Integer, List<Question>> questionsByExams = new HashMap<>();
        examinations.forEach(examination -> {
            questionsByExams.put(examination.getId(), examination.getQuestions().stream().toList());
        });
        List<Question> finalQuestions = new ArrayList<>();
        int generatedCount = 0;
        do {
            generatedCount++;
            List<Question> selectedQuestion = generateQuestion(allQuestions, levelsRequest, totalQuestions);
            List<Question> availableQuestions = new ArrayList<>();
            for (Map.Entry<Integer, List<Question>> entry : questionsByExams.entrySet()) {
                availableQuestions = checkDuplicatedQuestionInExamination(allQuestions, entry.getValue(), selectedQuestion);
            }
            finalQuestions.addAll(availableQuestions);
            if (finalQuestions.size()==totalQuestions){
                break;
            }
            if (generatedCount == 3){
                throw new InvalidQuantityException("Question","Not enough questions");
            }
            levelsRequest.entrySet().stream().peek(entry ->{
               entry.setValue(entry.getValue()-(int) finalQuestions.stream().filter(question -> {
                   return question.getLevel().getId() == entry.getKey();
               }).count());
            });
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
            exam.setCode(allQuestions.get(0).getSubject().getName()+ "_" + randomNumberStr + "_" +currentDate);
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
        return examinationRepository.findAll().stream().map(ExaminationMapper::convertToResponse).collect(Collectors.toList());
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
                        .collect(Collectors.toList()));
        return examinationResponse;
    }

    private List<Question> generateQuestion(List<Question> questions, Map<Integer, Integer> levelsRequest, int totalQuestions) {
        Collections.shuffle(questions);
        Map<Integer, Integer> questionsCountByLevels = levelsRequest;
        questionsCountByLevels.entrySet().stream().peek(integerIntegerEntry -> integerIntegerEntry.setValue(0)).collect(Collectors.toSet());
        return questions.stream()
                .filter(question -> {
                    for (Map.Entry<Integer, Integer> entry : questionsCountByLevels.entrySet()) {
                        if (question.getLevel().getId() == entry.getKey()){
                            return entry.getValue() > levelsRequest.get(entry.getKey());
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
                        return duplicatedQuestions.get() < 5;
                    }
                    return true;
                }).peek(question -> {
                    if (questionIds.contains(question.getId())) {
                        questionsDuplicated.add(question);
                        duplicatedQuestions.getAndIncrement();
                    }
                }).toList());
        if(selectedQuestions.size() >= (int) (questionsExisted.size()*0.3)){
            allQuestions.removeAll(selectedQuestions);
            selectedQuestions.removeAll(questionsDuplicated);
        }
        return selectedQuestions;
    }

    private void setAnswerForQuestion(Examination examination, Question question){
        int countCorrectAnswer = 0;
        QuestionRecord questionRecord = new QuestionRecord();
        questionRecord.setExamination(examination);
        questionRecord.setContent(question.getContent());
        questionRecord.setImage(question.getImage());
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
            answerRecordRepository.save(answerRecord);
        }
        questionRecord.setType(countCorrectAnswer == 1 ? 1 : 2);
        questionRecordRepository.save(questionRecord);
    }
}
