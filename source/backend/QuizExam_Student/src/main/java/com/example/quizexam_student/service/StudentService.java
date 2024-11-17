package com.example.quizexam_student.service;

import com.example.quizexam_student.bean.request.StudentRequest;
import com.example.quizexam_student.bean.response.StudentResponse;
import com.example.quizexam_student.entity.StudentDetail;
import com.example.quizexam_student.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface StudentService {
    List<StudentResponse> getAllStudents();
    List<StudentResponse> getAllStudentsAndStatusInactive();

    StudentDetail getStudentDetailByUser(User user);

    List<StudentResponse> getAllStudentsNoneClass();
    List<StudentResponse> getAllStudentsNoneClassAndStatusInactive();

    List<StudentResponse> getAllStudentsByClass(int classId);
    List<StudentResponse> getAllStudentsByClassAndStatusInactive(int classId);

    StudentDetail addStudent(StudentRequest studentRequest);

    StudentDetail updateStudent(StudentRequest studentRequest, int id);

    void updateClassForStudents(List<Integer> userIds, int classId);

    void deleteStudent(int id);

    void restoreStudent(int id);
}
