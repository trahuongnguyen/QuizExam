package com.example.quizexam_student.controller;

import com.example.quizexam_student.bean.request.*;
import com.example.quizexam_student.bean.response.*;
import com.example.quizexam_student.entity.StudentDetail;
import com.example.quizexam_student.entity.User;
import com.example.quizexam_student.service.*;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/student-management")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@Validated
public class StudentController {
    private final StudentService studentService;
    private final ExportService exportService;

    @PreAuthorize("hasAnyRole('ADMIN', 'SRO', 'DIRECTOR', 'TEACHER')")
    @GetMapping("/all-student")
    public List<StudentResponse> getAllStudents(){
        return studentService.getAllStudents();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SRO', 'TEACHER')")
    @GetMapping("/{status}")
    public List<StudentResponse> getAllStudentsNoneClass(@PathVariable Integer status){
        return studentService.getAllStudentsNoneClass(status);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SRO', 'TEACHER')")
    @GetMapping("/{classId}/{status}")
    public List<StudentResponse> getAllStudentsByClass(@PathVariable int classId, @PathVariable Integer status){
        return studentService.getAllStudentsByClass(classId, status);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SRO')")
    @PostMapping("")
    public ResponseEntity<RegisterResponse> addStudent(@RequestBody @Valid StudentRequest studentRequest) {
        studentService.addStudent(studentRequest);
        return ResponseEntity.ok(new RegisterResponse(studentRequest.getUserRequest().getEmail(), "Student created successfully"));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SRO')")
    @PutMapping("/{id}")
    public ResponseEntity<RegisterResponse> updateStudent(@PathVariable int id, @RequestBody @Valid StudentRequest studentRequest) {
        studentService.updateStudent(studentRequest, id);
        return ResponseEntity.ok(new RegisterResponse(studentRequest.getUserRequest().getEmail(), "Student updated successfully"));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SRO')")
    @PutMapping("/update-class")
    public ResponseEntity<RegisterResponse> updateClassForStudents(@RequestBody UpdateClassRequest request) {
        studentService.updateClassForStudents(request.getUserIds(), request.getClassId());
        return ResponseEntity.ok(new RegisterResponse("", "Update class successfully"));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SRO')")
    @PutMapping("/remove/{id}")
    public ResponseEntity<UserResponse> deleteStudent(@PathVariable int id) {
        return ResponseEntity.ok(studentService.deleteStudent(id));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SRO')")
    @PutMapping("/restore/{id}")
    public ResponseEntity<UserResponse> restoreStudent(@PathVariable int id) {
        return ResponseEntity.ok(studentService.restoreStudent(id));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SRO')")
    @PostMapping("/export/excel")
    public ResponseEntity<String> exportToExcel(HttpServletResponse response
            ,@RequestBody List<StudentResponse> studentResponses)
            throws IOException {
        exportService.export(response, "student", "xlsx");
        StudentExcelExporter excelExporter = new StudentExcelExporter(studentResponses);
        excelExporter.export(response);
        return new ResponseEntity<>("Export To Excel Successfully", HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SRO')")
    @PostMapping(value = "/export/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<String> exportToPDF(HttpServletResponse response
            ,@RequestBody List<StudentResponse> studentResponses) throws IOException {
        exportService.export(response, "student", "pdf");
        StudentPDFExporter pdfExporter = new StudentPDFExporter(studentResponses);
        pdfExporter.export(response);
        return new ResponseEntity<>("Export To PDF Successfully", HttpStatus.OK);
    }
}