package com.example.quizexam_student.controller;

import com.example.quizexam_student.bean.request.StudentRequest;
import com.example.quizexam_student.bean.request.UpdateClassRequest;
import com.example.quizexam_student.bean.request.UserAndStudentRequest;
import com.example.quizexam_student.bean.request.UserRequest;
import com.example.quizexam_student.bean.response.RegisterResponse;
import com.example.quizexam_student.bean.response.StudentResponse;
import com.example.quizexam_student.entity.StudentDetail;
import com.example.quizexam_student.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/studentManagement")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@Validated
@PreAuthorize("hasAnyRole('ADMIN', 'SRO')")
public class StudentController {
    private final StudentService studentService;

    @GetMapping("")
    public List<StudentResponse> getAllStudents(){
        return studentService.getAllStudentsNoneClass();
    }

    @GetMapping("{classId}")
    public List<StudentResponse> getAllStudentsByClass(@PathVariable int classId){
        return studentService.getAllStudentsByClass(classId);
    }

    @PostMapping("")
    public ResponseEntity<RegisterResponse> addStudent(@RequestBody @Valid StudentRequest studentRequest) {
        studentService.addStudent(studentRequest);
        return ResponseEntity.ok(new RegisterResponse(studentRequest.getUserRequest().getEmail(), "Student created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RegisterResponse> updateStudent(@PathVariable int id, @RequestBody @Valid StudentRequest studentRequest) {
        studentService.updateStudent(studentRequest, id);
        return ResponseEntity.ok(new RegisterResponse(studentRequest.getUserRequest().getEmail(), "Student updated successfully"));
    }

    @PutMapping("/update-class")
    public void updateClassForStudents(@RequestBody UpdateClassRequest request) {
        studentService.updateClassForStudents(request.getUserIds(), request.getClassId());
    }
}