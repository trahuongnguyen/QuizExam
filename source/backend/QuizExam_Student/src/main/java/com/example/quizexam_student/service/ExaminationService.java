package com.example.quizexam_student.service;

import com.example.quizexam_student.bean.request.ExaminationRequest;
import com.example.quizexam_student.bean.response.ExaminationResponse;
import com.example.quizexam_student.bean.response.StudentResponse;
import com.example.quizexam_student.entity.Examination;
import com.example.quizexam_student.entity.Mark;
import com.example.quizexam_student.entity.StudentDetail;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ExaminationService {
    Examination saveExamination(ExaminationRequest examinationRequest);
    ExaminationResponse getDetailExamination(int examinationId);
    Examination updateExamination(int examinationId, ExaminationRequest examinationRequest);
    List<StudentDetail> updateStudentForExam(int examinationId, List<Integer> studentIds);
    List<StudentResponse> getStudentsForExamination(int examinationId);
    List<StudentDetail> getListStudentsToAddForExamination(int examinationId);
    List<ExaminationResponse> getAllExaminationsForStudent(List<Mark> mark);
    List<ExaminationResponse> getAllExamBySemId(int semId);
}
