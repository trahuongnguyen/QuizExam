package com.example.quizexam_student.service.impl;

import com.example.quizexam_student.entity.Level;
import com.example.quizexam_student.repository.LevelRepository;
import com.example.quizexam_student.service.LevelService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LevelServiceImpl implements LevelService {
    private final LevelRepository levelRepository;
    @Override
    public List<Level> getAllLevels() {
        return levelRepository.findAllByStatus(1);
    }
}
