package com.example.quizexam_student.service;

import com.example.quizexam_student.bean.request.ExaminationRequest;
import com.example.quizexam_student.bean.response.ExaminationResponse;
import com.example.quizexam_student.bean.response.QuestionResponse;
import com.example.quizexam_student.entity.Examination;
import com.example.quizexam_student.entity.Question;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ExaminationService {
    Examination saveExamination(ExaminationRequest examinationRequest);
    ExaminationResponse getDetailExamination(int examinationId);
    List<ExaminationResponse> getAllExaminations();
}
