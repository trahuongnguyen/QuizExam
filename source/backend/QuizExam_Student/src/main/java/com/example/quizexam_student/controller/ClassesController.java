package com.example.quizexam_student.controller;

import com.example.quizexam_student.entity.Classes;
import com.example.quizexam_student.service.ClassesService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/class")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@Validated
public class ClassesController {
    private final ClassesService classesService;

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
}