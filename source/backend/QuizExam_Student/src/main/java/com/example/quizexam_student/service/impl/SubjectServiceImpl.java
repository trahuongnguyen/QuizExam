package com.example.quizexam_student.service.impl;

import com.example.quizexam_student.bean.request.SubjectRequest;
import com.example.quizexam_student.entity.*;
import com.example.quizexam_student.exception.*;
import com.example.quizexam_student.repository.*;
import com.example.quizexam_student.service.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubjectServiceImpl implements SubjectService {
    private final SubjectRepository subjectRepository;
    private final SemRepository semRepository;

    @Override
    public Boolean existSubjectByName(String subjectName) {
        Subject subject = subjectRepository.findByName(subjectName);
        return subject != null;
    }

    @Override
    public List<Subject> findAll() {
        return subjectRepository.findByStatus(1);
    }

    @Override
    public List<Subject> getAllSubjectBySem(int id) {
        Sem sem = semRepository.findById(id).orElse(null);
        return subjectRepository.findAllBySemAndStatusOrderByIdDesc(sem, 1);
    }

    @Override
    public Subject findById(int id) {
        return subjectRepository.findSubjectByIdAndStatus(id, 1).orElseThrow(() -> new NotFoundException("subject", "Subject not found"));
    }

    @Override
    public Subject save(SubjectRequest subjectRequest){
        if (subjectRepository.existsByNameAndStatus(subjectRequest.getName(),1)) {
            throw new AlreadyExistException("subjectName", "Class Name already exists.");
        }
        Subject subject = new Subject();
        subject.setName(subjectRequest.getName());
        subject.setImage(subjectRequest.getImage());
        subject.setStatus(1);
        subject.setSem(semRepository.findById(subjectRequest.getSemId()).orElse(null));
        return subjectRepository.save(subject);
    }

    @Override
    public Subject update(int id, SubjectRequest subjectRequest){
        Subject subject = subjectRepository.findSubjectByIdAndStatus(id, 1).orElseThrow(() -> new NotFoundException("subject", "Subject not found"));
        if (subjectRepository.existsByNameAndStatusAndIdNot(subjectRequest.getName(),1, id)) {
            throw new AlreadyExistException("subjectName", "Class Name already exists.");
        }
        Sem sem = semRepository.findById(subjectRequest.getSemId()).orElse(null);
        if (subjectRequest.getImage() != null) {
            subject.setImage(subjectRequest.getImage().isEmpty() ? null : subjectRequest.getImage());
        }
        subject.setSem(sem);
        subject.setName(subjectRequest.getName());
        return subjectRepository.save(subject);
    }

    @Override
    public Subject deleteById(int id) {
        Subject subject = subjectRepository.findSubjectByIdAndStatus(id, 1).orElseThrow(() -> new NotFoundException("subject", "Subject not found"));
        subject.setStatus(0);
        return subjectRepository.save(subject);
    }
}