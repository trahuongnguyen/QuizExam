package com.example.quizexam_student.service;

import com.example.quizexam_student.bean.request.SubjectRequest;
import com.example.quizexam_student.entity.Sem;
import com.example.quizexam_student.entity.Subject;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public interface SubjectService {
    Boolean existSubjectByName(String subjectName);
    List<Subject> findAll();
    Subject findById(int id);
    Subject save(SubjectRequest subjectRequest) throws IOException;
    void deleteById(int id);
    Subject update(int id, SubjectRequest subjectRequest) throws IOException;

    List<Subject> getAllSubjectBySem(int id);
}
