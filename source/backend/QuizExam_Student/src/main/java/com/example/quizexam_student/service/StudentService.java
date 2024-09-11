package com.example.quizexam_student.service;

import com.example.quizexam_student.entity.StudentDetail;
import com.example.quizexam_student.entity.User;
import org.springframework.stereotype.Service;

@Service
public interface StudentService {
    StudentDetail getStudentDetailByUser(User user);
}
