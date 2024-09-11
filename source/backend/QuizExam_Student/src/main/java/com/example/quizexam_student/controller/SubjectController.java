package com.example.quizexam_student.controller;

import com.example.quizexam_student.bean.request.SubjectRequest;
import com.example.quizexam_student.bean.response.*;
import com.example.quizexam_student.entity.Subject;
import com.example.quizexam_student.service.ExportService;
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
public class SubjectController {
    private final SubjectService subjectService;
    private final ExportService exportService;

    @GetMapping("")
    public List<Subject> getAll(){
        return subjectService.findAll();
    }

    @GetMapping("/{id}")
    public Subject getById(@PathVariable int id){
        return subjectService.findById(id);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('DIRECTOR')")
    @PostMapping("/save")
    public ResponseEntity<String> saveSubject(
            @Valid @RequestBody SubjectRequest subjectRequest,
            @RequestParam(value = "image", required = false) MultipartFile image)
            throws IOException {
        subjectService.save(subjectRequest, image);
        return new ResponseEntity<>("Save subject successfully", HttpStatus.OK);
    }

    @GetMapping("/update/{id}")
    public Subject updateSubject(@PathVariable int id){
        return subjectService.findById(id);
    }

    @PutMapping ("/update/{id}")
    public ResponseEntity<String> updateSubject(
            @PathVariable int id,
            @Valid @RequestBody SubjectRequest subjectRequest,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) throws IOException {
        subjectService.update(id,subjectRequest,image);
        return new ResponseEntity<>("Update subject successfully", HttpStatus.OK);
    }

    @PutMapping("/remove/{id}")
    public ResponseEntity<String> deleteSubject(@PathVariable int id){
        subjectService.deleteById(id);
        return new ResponseEntity<>("Delete subject successfully", HttpStatus.OK);
    }

    @GetMapping("/export/excel")
    public ResponseEntity<String> exportToExcel(HttpServletResponse response) throws IOException {
        exportService.export(response, "subject", "xlsx");
        List<Subject> subjects = subjectService.findAll();
        SubjectExcelExporter excelExporter = new SubjectExcelExporter(subjects);
        excelExporter.export(response);
        return new ResponseEntity<>("Export To Excel Successfully", HttpStatus.OK);
    }

    @GetMapping(value = "/export/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<String> exportToPDF(HttpServletResponse response) throws IOException {
        exportService.export(response, "subject", "pdf");
        List<Subject> subjects = subjectService.findAll();
        SubjectPDFExporter subjectPDFExporter = new SubjectPDFExporter(subjects);
        subjectPDFExporter.export(response);
        return new ResponseEntity<>("Export To PDF Successfully", HttpStatus.OK);
    }
}
