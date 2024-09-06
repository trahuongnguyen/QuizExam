package com.example.quizexam_student.service;

import com.example.quizexam_student.entity.Classes;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ClassesService {
    public List<Classes> getAllClasses();

    public Classes addClass(Classes _class);

    public Classes updateClass(int id, Classes _class);

    public void deleteClass(int id);
}