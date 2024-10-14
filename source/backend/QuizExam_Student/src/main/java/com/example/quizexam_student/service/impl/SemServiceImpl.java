package com.example.quizexam_student.service.impl;

import com.example.quizexam_student.entity.Sem;
import com.example.quizexam_student.exception.NotFoundException;
import com.example.quizexam_student.repository.SemRepository;
import com.example.quizexam_student.service.SemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SemServiceImpl implements SemService {

    private final SemRepository semRepository;

    @Override
    public List<Sem> getAllSem() {
        return semRepository.findAll();
    }

    @Override
    public Sem getSemById(int id) {
        return semRepository.findById(id).orElseThrow(() -> new NotFoundException("EmptySem","Semester not found"));
    }

    @Override
    public Sem getSemByName(String name) {
        return semRepository.findByName(name);
    }
}
