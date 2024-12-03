package com.example.quizexam_student.controller;

import com.example.quizexam_student.bean.request.ExaminationRequest;
import com.example.quizexam_student.bean.response.*;
import com.example.quizexam_student.entity.*;
import com.example.quizexam_student.mapper.ExaminationMapper;
import com.example.quizexam_student.repository.MarkRepository;
import com.example.quizexam_student.repository.UserRepository;
import com.example.quizexam_student.service.ExaminationService;
import com.example.quizexam_student.service.ExportService;
import com.example.quizexam_student.service.SubjectService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/exam")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@Validated
public class ExaminationController {
    private final ExaminationService examinationService;
    private final ExportService exportService;
    private final MarkRepository markRepository;
    private final UserRepository userRepository;
    @Value("${uploads.question}")
    private String uploadDir;

    @PreAuthorize("hasAnyRole('ADMIN', 'SRO', 'STUDENT')")
    @GetMapping("/{examinationId}")
    public ExaminationResponse getDetailExamination(@PathVariable int examinationId) {
        return examinationService.getDetailExamination(examinationId);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SRO', 'TEACHER', 'DIRECTOR')")
    @GetMapping("/all")
    public List<ExaminationResponse> getAllExamination(){
        return examinationService.getAllExaminations();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SRO', 'DIRECTOR', 'TEACHER')")
    @GetMapping("/subject/{subjectId}")
    public List<ExaminationResponse> getAllExaminationBySubject(@PathVariable int subjectId){
        return examinationService.getAllExaminationBySubjectId(subjectId);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SRO', 'DIRECTOR', 'TEACHER')")
    @GetMapping("/finish/sem/{semId}")
    public List<ExaminationResponse> getAllExaminationFinishedBySemId(@PathVariable int semId){
        return examinationService.getAllExaminationFinishedBySemId(semId);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SRO')")
    @GetMapping("/sem/{semId}")
    public List<ExaminationResponse> getExaminationBySemId(@PathVariable int semId) {
        return examinationService.getAllExamBySemId(semId);
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("")
    public List<ExaminationResponse> getAllExaminationsForStudent() {
        String email = ((org.springframework.security.core.userdetails.User)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User user = userRepository.findByEmailAndStatus(email, 1).orElse(null);
        assert user != null;
        StudentDetail studentDetail = user.getStudentDetail();
        List<Mark> marks = markRepository.findAllByStudentDetailAndScoreIsNull(studentDetail);
        return examinationService.getAllExaminationsForStudent(marks);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SRO')")
    @PostMapping("")
    public ExaminationResponse save(@RequestBody @Valid ExaminationRequest examinationRequest) {
        return ExaminationMapper.convertToResponse(examinationService.saveExamination(examinationRequest));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SRO')")
    @PostMapping("/createExamWithSelectingQuestions")
    public ExaminationResponse createWithSelectingQuestions(@RequestPart(name = "exam") @Valid ExaminationRequest examinationRequest, @RequestPart(name = "question") List<Integer> questionIds) {
        return ExaminationMapper.convertToResponse(examinationService.createExamination(examinationRequest, questionIds));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SRO')")
    @GetMapping("/{examinationId}/students")
    public List<StudentResponse> getStudentsByExamination(@PathVariable int examinationId) {
        return examinationService.getStudentsForExamination(examinationId);
    }

//    @PreAuthorize("hasAnyRole('ADMIN', 'SRO')") //chua dung
//    @GetMapping("/{examinationId}/studentsToAdd")
//    public List<StudentDetail> getStudentsToAddByExamination(@PathVariable int examinationId) {
//        return examinationService.getListStudentsToAddForExamination(examinationId);
//    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SRO')")
    @PutMapping("/{examinationId}")
    public ExaminationResponse update(@PathVariable int examinationId, @RequestBody ExaminationRequest examinationRequest) {
        return ExaminationMapper.convertToResponse(examinationService.updateExamination(examinationId, examinationRequest));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SRO')")
    @PutMapping("/student/{examinationId}")
    public ResponseEntity<RegisterResponse> updateStudentForExam(
            @PathVariable int examinationId,
            @RequestBody List<Integer> studentIds){
        examinationService.updateStudentForExam(examinationId, studentIds);
        return ResponseEntity.ok(new RegisterResponse("", "Modify student successfully"));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SRO')")
    @PostMapping(value = "/export/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<String> exportToPDF(
            HttpServletResponse response,
            @RequestBody ExaminationResponse examinationResponse)
            throws IOException {
        exportService.export(response, examinationResponse.getName() + "_exam", "pdf");
        ExamPDFExporter pdfExporter = new ExamPDFExporter(examinationResponse, uploadDir);
        pdfExporter.export(response);
        return new ResponseEntity<>("Export To PDF Successfully", HttpStatus.OK);
    }
}
