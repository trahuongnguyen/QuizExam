package com.example.quizexam_student.service;

import com.example.quizexam_student.bean.response.MarkResponse;
import com.example.quizexam_student.entity.Mark;
import com.example.quizexam_student.entity.StudentDetail;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface MarkService {
    List<MarkResponse> getListScoredPerSubject(StudentDetail studentDetail, int semId);
    MarkResponse getOneScoredByExam(StudentDetail studentDetail, int examId);

    Mark updateBeginTime(int id);

    Mark updateWarning(int id, Mark mark);
}
