package com.example.quizexam_student.service;

import com.example.quizexam_student.entity.Mark;
import com.example.quizexam_student.entity.StudentDetail;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface MarkService {
    List<Mark> getListScoredBySubject (StudentDetail studentDetail);
    Mark getOneScoredByExam(StudentDetail studentDetail, int examId);
}
