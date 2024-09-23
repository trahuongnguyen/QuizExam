package com.example.quizexam_student.service.impl;

import com.example.quizexam_student.bean.request.SubjectRequest;
import com.example.quizexam_student.entity.Sem;
import com.example.quizexam_student.entity.Subject;
import com.example.quizexam_student.exception.AlreadyExistException;
import com.example.quizexam_student.exception.EmptyException;
import com.example.quizexam_student.exception.NotFoundException;
import com.example.quizexam_student.repository.SemRepository;
import com.example.quizexam_student.repository.SubjectRepository;
import com.example.quizexam_student.service.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

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
    public Subject findById(int id) {
        return subjectRepository.findById(id).orElseThrow(() -> new NotFoundException("NotFoundSubject","Subject not found"));
    }

    @Override
    public Subject save(SubjectRequest subjectRequest){
        if (existSubjectByName(subjectRequest.getName())) {
            throw new AlreadyExistException("AlreadyExistSubject","Subject already exist");
        }
        Subject subject = new Subject();
        subject.setName(subjectRequest.getName());
        subject.setImage(subjectRequest.getImage());
        subject.setStatus(1);
        subject.setSem(semRepository.findById(subjectRequest.getSemId()).orElse(null));
        return subjectRepository.save(subject);
    }



    @Override
    public void deleteById(int id) {
        Subject subject = subjectRepository.findById(id).orElseThrow(() -> new NotFoundException("NotFoundSubject","Subject not found"));
        subject.setStatus(0);
        subjectRepository.save(subject);
    }

    @Override
    public Subject update(int id, SubjectRequest subjectRequest){
        Subject subject = subjectRepository.findById(id).orElseThrow(() -> new NotFoundException("NotFoundSubject","Subject not found"));
        if (existSubjectByName(subject.getName()) && subject.getName().equals(subjectRequest.getName())) {
            throw new AlreadyExistException("AlreadyExistSubject","Subject already exist");
        }
        subject.setName(subjectRequest.getName());
        subject.setImage(subjectRequest.getImage());
        return subjectRepository.save(subject);
    }

    @Override
    public List<Subject> getAllSubjectBySem(int id) {
        Sem sem = semRepository.findById(id).orElse(null);
        return subjectRepository.findBySemAndStatus(sem, 1);
    }
}
