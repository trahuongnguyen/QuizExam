package com.example.quizexam_student.service;

import com.example.quizexam_student.bean.request.UserRequest;
import com.example.quizexam_student.entity.StudentDetail;
import com.example.quizexam_student.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface StudentService {
    public StudentDetail getStudentDetailByUser(User user);

    public StudentDetail addStudent(UserRequest userRequest, StudentDetail studentDetail);

    public StudentDetail updateStudent(UserRequest userRequest, StudentDetail studentDetail, int id);

    public void updateClassForStudents(List<Integer> userIds, int classId);
}
