package com.example.quizexam_student.service.impl;

import com.example.quizexam_student.bean.request.StudentAnswerRequest;
import com.example.quizexam_student.bean.request.StudentQuestionAnswer;
import com.example.quizexam_student.entity.*;
import com.example.quizexam_student.exception.AlreadyExistException;
import com.example.quizexam_student.exception.NotFoundException;
import com.example.quizexam_student.repository.*;
import com.example.quizexam_student.service.StudentAnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentAnswerServiceImpl implements StudentAnswerService {
    private final StudentAnswerRepository studentAnswerRepository;

    private final MarkRepository markRepository;

    private final QuestionRecordRepository questionRecordRepository;

    private final AnswerRecordRepository answerRecordRepository;

    private final LevelRepository levelRepository;

    @Override
    public StudentAnswerRequest saveStudentAnswers(StudentAnswerRequest studentAnswerRequest) {
        Mark mark = markRepository.findById(studentAnswerRequest.getMarkId()).orElse(null);

        if (!Objects.isNull(mark)) {
            if (mark.getScore() != null) {
                throw new AlreadyExistException("mark", "This test has already been scored.");
            }

            int totalScore = 0;

            for (StudentQuestionAnswer studentQuestionAnswer : studentAnswerRequest.getStudentQuestionAnswers()) {
                QuestionRecord questionRecord = questionRecordRepository.findById(studentQuestionAnswer.getQuestionRecordId()).orElse(null);

                if (!Objects.isNull(questionRecord)) {
                    // Lấy tất cả các đáp án đúng cho câu hỏi này
                    Set<Integer> correctAnswerIds = new HashSet<>();
                    for (AnswerRecord answerRecord : questionRecord.getAnswerRecords()) {
                        if (answerRecord.getIsCorrect() == 1) {
                            correctAnswerIds.add(answerRecord.getId());
                        }
                    }

                    // Tạo Set để lưu các đáp án được sinh viên chọn
                    Set<Integer> selectedAnswerIds = new HashSet<>(studentQuestionAnswer.getSelectedAnswerIds());

                    // Kiểm tra nếu sinh viên chọn đúng tất cả các đáp án
                    if (selectedAnswerIds.equals(correctAnswerIds)) {
                        totalScore += questionRecord.getPoint(); // Cộng điểm
                    }

                    // Lưu từng câu trả lời của sinh viên
                    for (Integer selectedAnswerId : studentQuestionAnswer.getSelectedAnswerIds()) {
                        AnswerRecord answerRecord = answerRecordRepository.findById(selectedAnswerId).orElse(null);

                        StudentAnswer studentAnswer = new StudentAnswer();
                        studentAnswer.setMark(mark);
                        studentAnswer.setQuestionRecord(questionRecord);
                        if (!Objects.isNull(answerRecord)) {
                            studentAnswer.setSelectedAnswer(answerRecord.getId());
                        }
                        studentAnswerRepository.save(studentAnswer);
                    }
                }
            }

            mark.setScore(totalScore);
            mark.setSubmittedTime(LocalDateTime.now());
            markRepository.save(mark);
        }
        return studentAnswerRequest;
    }

    public Map<String, Integer> scoreByLevel(StudentDetail studentDetail, Integer examinationId) {
        Mark mark = markRepository.findByStudentDetailAndExaminationId(studentDetail, examinationId);

        if (Objects.isNull(mark)) {
            throw new NotFoundException("mark", "Mark not found");
        }

        // Lấy danh sách câu hỏi và câu trả lời liên quan đến bài thi
        List<QuestionRecord> questionRecords = questionRecordRepository.findQuestionRecordsByExaminationId(mark.getExamination().getId());
        List<StudentAnswer> studentAnswers = studentAnswerRepository.findByMarkId(mark.getId());

        List<Level> levels = levelRepository.findAllByStatus(1);
        Map<String, Integer> scoreByLevel = new HashMap<>();

        // Khởi tạo điểm cho từng level
        for (Level level : levels) {
            scoreByLevel.put(level.getName(), 0); // Gán điểm khởi tạo là 0
        }

        int totalScore = 0;

        // Duyệt qua từng câu hỏi
        for (QuestionRecord questionRecord : questionRecords) {
            // Lấy các đáp án cho câu hỏi
            List<AnswerRecord> answerRecords = answerRecordRepository.findAllByQuestionRecord(questionRecord);

            // Lưu các ID đáp án đúng
            Set<Integer> correctAnswerIds = answerRecords.stream()
                    .filter(answerRecord -> answerRecord.getIsCorrect() == 1)
                    .map(AnswerRecord::getId)
                    .collect(Collectors.toSet());

            // Lấy ID đáp án của học sinh cho câu hỏi này
            Set<Integer> selectedAnswerIds = studentAnswers.stream()
                    .filter(ans -> ans.getQuestionRecord().equals(questionRecord))
                    .map(StudentAnswer::getSelectedAnswer)
                    .collect(Collectors.toSet());

            // Nếu tất cả đáp án đúng đều được học sinh chọn, cộng điểm
            if (selectedAnswerIds.containsAll(correctAnswerIds)) {
                String level = questionRecord.getLevel();
                scoreByLevel.put(level, scoreByLevel.getOrDefault(level, 0) + questionRecord.getPoint()); // Cộng điểm cho level tương ứng
            }
        }

        return scoreByLevel;
    }
}