package com.example.quizexam_student.service.impl;

import com.example.quizexam_student.bean.request.StudentAnswerRequest;
import com.example.quizexam_student.bean.request.StudentQuestionAnswer;
import com.example.quizexam_student.entity.AnswerRecord;
import com.example.quizexam_student.entity.Mark;
import com.example.quizexam_student.entity.QuestionRecord;
import com.example.quizexam_student.entity.StudentAnswer;
import com.example.quizexam_student.exception.AlreadyExistException;
import com.example.quizexam_student.repository.AnswerRecordRepository;
import com.example.quizexam_student.repository.MarkRepository;
import com.example.quizexam_student.repository.QuestionRecordRepository;
import com.example.quizexam_student.repository.StudentAnswerRepository;
import com.example.quizexam_student.service.StudentAnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class StudentAnswerServiceImpl implements StudentAnswerService {
    private final StudentAnswerRepository studentAnswerRepository;

    private final MarkRepository markRepository;

    private final QuestionRecordRepository questionRecordRepository;

    private final AnswerRecordRepository answerRecordRepository;

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
}