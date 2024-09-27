package com.example.quizexam_student.controller;

import com.example.quizexam_student.bean.request.SubjectRequest;
import com.example.quizexam_student.bean.response.*;
import com.example.quizexam_student.entity.Sem;
import com.example.quizexam_student.entity.Subject;
import com.example.quizexam_student.service.ExportService;
import com.example.quizexam_student.service.SemService;
import com.example.quizexam_student.service.SubjectService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/subject")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@Validated
@PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR')")
public class SubjectController {
    private final SubjectService subjectService;
    private final ExportService exportService;
    private final SemService semService;

    @GetMapping("")
    public List<Subject> getAll(){
        return subjectService.findAll();
    }

    //@PreAuthorize("hasRole('ADMIN') or hasRole('DIRECTOR')")
    @PostMapping("/save")
    public ResponseEntity<Subject> saveSubject(@Valid @RequestBody SubjectRequest subjectRequest) {
        return  ResponseEntity.ok(subjectService.save(subjectRequest));
    }

    @GetMapping("/{id}")
    public Subject getSubjectById(@PathVariable int id){
        return subjectService.findById(id);
    }

    @GetMapping("/sem/{id}")
    public List<Subject> getAllSubjects(@PathVariable Integer id){
        return subjectService.getAllSubjectBySem(id);
    }

    @PutMapping ("/{id}")
    public Subject updateSubject(@PathVariable int id, @Valid @RequestBody SubjectRequest subjectRequest) {
        return subjectService.update(id,subjectRequest);
    }

    @DeleteMapping("/{id}")
    public void deleteSubject(@PathVariable int id){
        subjectService.deleteById(id);
    }

    @PostMapping("/export/excel")
    public ResponseEntity<String> exportToExcel(HttpServletResponse response, @RequestBody List<Subject> subjects) throws IOException {
        exportService.export(response, "subject", "xlsx");
        SubjectExcelExporter excelExporter = new SubjectExcelExporter(subjects);
        excelExporter.export(response);
        return new ResponseEntity<>("Export To Excel Successfully", HttpStatus.OK);
    }

    @PostMapping(value = "/export/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<String> exportToPDF(HttpServletResponse response, @RequestBody List<Subject> subjects) throws IOException {
        exportService.export(response, "subject", "pdf");
        SubjectPDFExporter subjectPDFExporter = new SubjectPDFExporter(subjects);
        subjectPDFExporter.export(response);
        return new ResponseEntity<>("Export To PDF Successfully", HttpStatus.OK);
    }
}
