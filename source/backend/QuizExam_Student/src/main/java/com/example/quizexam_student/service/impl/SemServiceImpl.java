package com.example.quizexam_student.service.impl;

import com.example.quizexam_student.entity.Sem;
import com.example.quizexam_student.exception.EmptyException;
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
        List<Sem> semList = semRepository.findAll();
        if (semList.isEmpty()) {
            throw new EmptyException("EmptySem","Semeter list is empty");
        }
        return semList;
    }

    @Override
    public Sem getSemById(int id) {
        return semRepository.findById(id).orElseThrow(() -> new NotFoundException("EmptySem","Semeter not found"));
    }

    @Override
    public Sem getSemByName(String name) {
        return semRepository.findByName(name);
    }
}
