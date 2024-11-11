package com.example.quizexam_student.controller;

import com.example.quizexam_student.entity.Level;
import com.example.quizexam_student.service.LevelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/level")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class LevelController {
    private final LevelService levelService;

    @GetMapping
    public List<Level> getAllLevels() {
        return levelService.getAllLevels();
    }

    @GetMapping("/{id}")
    public Level getLevelById(@PathVariable int id) {
        return levelService.getLevelById(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR')")
    @PostMapping
    public Level addLevel(@Valid @RequestBody Level level) {
        return levelService.addLevel(level);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR')")
    @PutMapping("/{id}")
    public Level updateLevel(@PathVariable int id, @Valid @RequestBody Level level) {
        return levelService.editLevel(id, level);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR')")
    @PutMapping("/delete/{id}")
    public Level deleteLevel(@PathVariable int id) {
        return levelService.deleteLevelById(id);
    }
}
