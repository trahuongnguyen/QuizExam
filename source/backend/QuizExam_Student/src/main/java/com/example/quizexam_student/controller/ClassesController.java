package com.example.quizexam_student.controller;

import com.example.quizexam_student.bean.response.ClassesExcelExporter;
import com.example.quizexam_student.bean.response.ClassesPDFExporter;
import com.example.quizexam_student.bean.response.SubjectExcelExporter;
import com.example.quizexam_student.bean.response.SubjectPDFExporter;
import com.example.quizexam_student.entity.Classes;
import com.example.quizexam_student.entity.Subject;
import com.example.quizexam_student.service.ClassesService;
import com.example.quizexam_student.service.ExportService;
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
@RequestMapping("/api/class")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@Validated
@PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'SRO')")
public class ClassesController {
    private final ClassesService classesService;
    private final ExportService exportService;

    @GetMapping
    public List<Classes> getAllClasses(){
        return classesService.getAllClasses();
    }

    @PostMapping
    public Classes addClass(@RequestBody @Valid Classes _class){
        return classesService.addClass(_class);
    }

    @PutMapping("/{id}")
    public Classes updateClass(@PathVariable Integer id, @RequestBody @Valid Classes _class){
        return classesService.updateClass(id, _class);
    }

    @DeleteMapping("/{id}")
    public void deleteClass(@PathVariable Integer id) {
        classesService.deleteClass(id);
    }

    @PostMapping("/export/excel")
    public ResponseEntity<String> exportToExcel(HttpServletResponse response,@RequestBody List<Classes> classes) throws IOException {
        exportService.export(response, "classes", "xlsx");
        ClassesExcelExporter excelExporter = new ClassesExcelExporter(classes);
        excelExporter.export(response);
        return new ResponseEntity<>("Export To Excel Successfully", HttpStatus.OK);
    }

    @PostMapping(value = "/export/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<String> exportToPDF(HttpServletResponse response, @RequestBody List<Classes> classes) throws IOException {
        exportService.export(response, "classes", "pdf");
        ClassesPDFExporter pdfExporter = new ClassesPDFExporter(classes);
        pdfExporter.export(response);
        return new ResponseEntity<>("Export To PDF Successfully", HttpStatus.OK);
    }
}