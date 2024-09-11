package com.example.quizexam_student.service.impl;

import com.example.quizexam_student.entity.StudentDetail;
import com.example.quizexam_student.entity.User;
import com.example.quizexam_student.repository.StudentRepository;
import com.example.quizexam_student.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {
    private final StudentRepository studentRepository;
    @Override
    public StudentDetail getStudentDetailByUser(User user) {
        return studentRepository.findStudentDetailByUser(user);
    }
}
