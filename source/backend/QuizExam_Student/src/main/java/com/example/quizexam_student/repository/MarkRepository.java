package com.example.quizexam_student.repository;

import com.example.quizexam_student.entity.Examination;
import com.example.quizexam_student.entity.Mark;
import com.example.quizexam_student.entity.StudentDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MarkRepository extends JpaRepository<Mark, Integer> {
    List<Mark> findAllByExaminationIdAndScoreAndBeginTime(int examinationId, Integer score, LocalDateTime beginTime);
    List<Mark> findAllByExaminationId(int examinationId);
    List<Mark> findAllByStudentDetailAndScoreIsNotNull(StudentDetail studentDetail);
    Mark findByStudentDetailAndExaminationId(StudentDetail studentDetail, int examinationId);
    List<Mark> findAllByStudentDetailAndScoreIsNull(StudentDetail studentDetail);
    List<Mark> findAllByStudentDetailAndScoreIsNullAndBeginTimeIsNotNull(StudentDetail studentDetail);
    List<Mark> findAllByScoreIsNotNull();
    List<Mark> findAllByExamination(Examination examination);
}
