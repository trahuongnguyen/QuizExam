package com.example.quizexam_student.service.impl;

import com.example.quizexam_student.entity.Classes;
import com.example.quizexam_student.exception.AlreadyExistException;
import com.example.quizexam_student.exception.NotFoundException;
import com.example.quizexam_student.repository.ClassesRepository;
import com.example.quizexam_student.service.ClassesService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ClassesServiceImpl implements ClassesService {
    private final ClassesRepository classesRepository;

    @Override
    public List<Classes> getAllClasses() {
        return classesRepository.findByStatus(1);
    }

    @Override
    public Classes addClass(Classes _class) {
        if (classesRepository.existsByName(_class.getName())) {
            throw new AlreadyExistException("Class Name already exists.");
        }
        _class.setStatus(1);
        return classesRepository.save(_class);
    }

    @Override
    public Classes updateClass(int id, Classes classInput) {
        Classes classUpdate = classesRepository.findById(id).orElse(null);
        if (Objects.isNull(classUpdate) || classUpdate.getStatus() == 0) {
            throw new NotFoundException("Class not found.");
        }
        if (classesRepository.existsByNameAndIdNot(classInput.getName(), id)) {
            throw new AlreadyExistException("Class Name already exists.");
        }
        setClass(classUpdate, classInput);
        return classesRepository.save(classUpdate);
    }

    @Override
    public void deleteClass(int id) {
        Classes classDelete = classesRepository.findById(id).orElse(null);
        if (Objects.isNull(classDelete) || classDelete.getStatus() == 0) {
            throw new NotFoundException("Class not found.");
        }
        classDelete.setStatus(0);
        classesRepository.save(classDelete);
    }

    private void setClass(Classes classUpdate, Classes classInput) {
        classUpdate.setName(classInput.getName());
        classUpdate.setClassDay(classInput.getClassDay());
        classUpdate.setClassTime(classInput.getClassTime());
    }
}