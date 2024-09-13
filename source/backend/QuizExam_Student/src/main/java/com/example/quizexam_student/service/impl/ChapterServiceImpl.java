package com.example.quizexam_student.service.impl;

import com.example.quizexam_student.bean.request.ChapterRequest;
import com.example.quizexam_student.entity.Chapter;
import com.example.quizexam_student.entity.Subject;
import com.example.quizexam_student.exception.AlreadyExistException;
import com.example.quizexam_student.exception.EmptyException;
import com.example.quizexam_student.exception.NotFoundException;
import com.example.quizexam_student.repository.ChapterRepository;
import com.example.quizexam_student.repository.SubjectRepository;
import com.example.quizexam_student.service.ChapterService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChapterServiceImpl implements ChapterService {
    private final ChapterRepository chapterRepository;
    private final SubjectRepository subjectRepository;

    private Boolean ExistChapterName(String chapterName) {
        return chapterRepository.findByName(chapterName) != null;
    }
    private Boolean ExistSubjectId(int id){
        Subject subject = subjectRepository.findById(id).orElse(null);
        return subject != null;
    }
    @Override
    public List<Chapter> getAllChaptersBySubjectId(int subjectId) {
        List<Chapter> chapterList = chapterRepository.findAllByStatusAndSubjectId(1, subjectId);
        if (chapterList == null) {
            throw new EmptyException("EmptyChapter", "Chapter list is empty");
        }
        return chapterList;
    }

    @Override
    public Chapter addChapter(ChapterRequest chapterRequest) {
        if (ExistChapterName(chapterRequest.getName())) {
            throw new AlreadyExistException("ExistChapter", "Chapter name already exists");
        }
        if (!ExistSubjectId(chapterRequest.getSubjectId())) {
            throw new NotFoundException("NotFoundSubject", "Subject id not found");
        }
        Chapter chapter = new Chapter();
        chapter.setName(chapterRequest.getName());
        Subject subject = subjectRepository.findById(chapterRequest.getSubjectId()).orElse(null);
        chapter.setSubject(subject);
        chapter.setStatus(1);
        return chapterRepository.save(chapter);
    }

    @Override
    public Chapter getChapterById(int id) {
        return chapterRepository.findById(id).orElseThrow(() -> new NotFoundException("NotFoundChapter", "Chapter not found"));
    }

    @Override
    public Chapter updateChapter(int id, ChapterRequest chapterRequest) {
        Chapter oldChapter = chapterRepository.findById(id).orElseThrow(() -> new NotFoundException("NotFoundChapter", "Chapter not found"));
        if (ExistChapterName(chapterRequest.getName()) && oldChapter.getName().equals(chapterRequest.getName())) {
            throw new AlreadyExistException("ExistChapter", "Chapter name already exists");
        }
        if (!ExistSubjectId(chapterRequest.getSubjectId())) {
            throw new NotFoundException("NotFoundSubject", "Subject id not found");
        }
        oldChapter.setName(chapterRequest.getName());
        Subject subject = subjectRepository.findById(chapterRequest.getSubjectId()).orElse(null);
        oldChapter.setSubject(subject);
        return chapterRepository.save(oldChapter);
    }

    @Override
    public void deleteChapter(int id) {
        Chapter oldChapter = chapterRepository.findById(id).orElseThrow(() -> new NotFoundException("NotFoundChapter", "Chapter not found"));
        oldChapter.setStatus(0);
        chapterRepository.save(oldChapter);
    }
}
