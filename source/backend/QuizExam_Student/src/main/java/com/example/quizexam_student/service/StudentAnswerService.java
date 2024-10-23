package com.example.quizexam_student.service;

import com.example.quizexam_student.bean.request.StudentAnswerRequest;
import com.example.quizexam_student.entity.StudentAnswer;
import org.springframework.stereotype.Service;

@Service
public interface StudentAnswerService {
    StudentAnswerRequest saveStudentAnswers(StudentAnswerRequest studentAnswerRequest);
}
