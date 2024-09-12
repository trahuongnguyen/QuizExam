package com.example.quizexam_student.controller;

import com.example.quizexam_student.bean.request.UserAndStudentRequest;
import com.example.quizexam_student.bean.request.UserRequest;
import com.example.quizexam_student.entity.StudentDetail;
import com.example.quizexam_student.entity.User;
import com.example.quizexam_student.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/studentManagement")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@Validated
public class StudentController {
    private final StudentService studentService;

    @PostMapping
    public ResponseEntity<StudentDetail> addStudent(@RequestBody @Valid UserAndStudentRequest request) {
        UserRequest user = request.getUser();
        StudentDetail studentDetail = request.getStudentDetail();
        StudentDetail savedStudent = studentService.addStudent(user, studentDetail);
        return ResponseEntity.ok(savedStudent);
    }

    @PutMapping("/{id}")
    public StudentDetail updateStudent(@PathVariable int id, @RequestBody @Valid UserAndStudentRequest request) {
        UserRequest user = request.getUser();
        StudentDetail studentDetail = request.getStudentDetail();
        return studentService.updateStudent(user, studentDetail, id);
    }
}