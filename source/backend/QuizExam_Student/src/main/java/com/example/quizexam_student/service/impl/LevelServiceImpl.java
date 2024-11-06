package com.example.quizexam_student.service.impl;

import com.example.quizexam_student.entity.Level;
import com.example.quizexam_student.exception.AlreadyExistException;
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

    private Boolean levelNameExisted(String levelName) {
        return levelRepository.findByNameAndStatus(levelName, 1) != null;
    }

    @Override
    public Level getLevelById(Integer id) {
        return levelRepository.findByIdAndStatus(id,1);
    }

    @Override
    public Level addLevel(Level level) {
        if (levelNameExisted(level.getName())) {
            throw new AlreadyExistException("Name", "Level Name already exist");
        }
        level.setStatus(1);
        level.setPoint(1);
        return levelRepository.save(level);
    }

    @Override
    public Level editLevel(Integer id, Level level) {
        Level oldLevel = levelRepository.findByIdAndStatus(id,1);
        if (levelNameExisted(level.getName()) && !level.getName().equals(oldLevel.getName())) {
            throw new AlreadyExistException("Name", "Level Name already exist");
        }
        oldLevel.setName(level.getName());
        oldLevel.setPoint(level.getPoint());
        return levelRepository.save(oldLevel);
    }

    @Override
    public Level deleteLevelById(Integer id) {
        Level level = levelRepository.findByIdAndStatus(id,1);
        level.setStatus(0);
        return levelRepository.save(level);
    }
}
