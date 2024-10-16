package com.example.quizexam_student.controller;

import com.example.quizexam_student.bean.request.ExaminationRequest;
import com.example.quizexam_student.bean.response.ExaminationResponse;
import com.example.quizexam_student.bean.response.ExaminationResponseNotIncludeQuestion;
import com.example.quizexam_student.bean.response.StudentResponse;
import com.example.quizexam_student.entity.Examination;
import com.example.quizexam_student.entity.StudentDetail;
import com.example.quizexam_student.service.ExaminationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exam")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@Validated
@PreAuthorize("permitAll()")
public class ExaminationController {

    private final ExaminationService examinationService;

    @GetMapping("/{examinationId}")
    public ExaminationResponse getDetailExamination(@PathVariable int examinationId) {
        return examinationService.getDetailExamination(examinationId);
    }

    @GetMapping("")
    public List<ExaminationResponse> getAllExamination() {
        return examinationService.getAllExaminations();
    }

    @PostMapping("")
    public Examination save(@RequestBody ExaminationRequest examinationRequest) {
        return examinationService.saveExamination(examinationRequest);
    }

    @GetMapping("{examinationId}/students")
    public List<StudentResponse> getStudentsByExamination(@PathVariable int examinationId) {
        return examinationService.getStudentsForExamination(examinationId);
    }

    @GetMapping("{examinationId}/studentsToAdd")
    public List<StudentDetail> getStudentsToAddByExamination(@PathVariable int examinationId) {
        return examinationService.getListStudentsToAddForExamination(examinationId);
    }

    @GetMapping("/inform/{examinationId}")
    public ExaminationResponseNotIncludeQuestion getInformExamination(@PathVariable int examinationId) {
        return examinationService.getExaminationNotIncludeQuestion(examinationId);
    }

    @PutMapping("/{examinationId}")
    public Examination update(@PathVariable int examinationId, @RequestBody ExaminationRequest examinationRequest) {
        return examinationService.updateExamination(examinationId, examinationRequest);
    }

    @PutMapping("/student/{examinationId}/{subjectId}")
    public List<StudentDetail> updateStudentForExam(
            @PathVariable int examinationId,
            @PathVariable int subjectId,
            @RequestBody List<Integer> studentIds){
        return examinationService.updateStudentForExam(examinationId, subjectId, studentIds);
    }
}
