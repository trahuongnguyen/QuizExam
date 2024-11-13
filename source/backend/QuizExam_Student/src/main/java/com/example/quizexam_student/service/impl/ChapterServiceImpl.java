package com.example.quizexam_student.service.impl;

import com.example.quizexam_student.bean.request.ChapterRequest;
import com.example.quizexam_student.entity.Chapter;
import com.example.quizexam_student.entity.Subject;
import com.example.quizexam_student.exception.AlreadyExistException;
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

    @Override
    public Boolean ExistChapterName(String chapterName) {
        return chapterRepository.findByNameAndStatus(chapterName,1) != null;
    }

    @Override
    public Boolean ExistSubjectId(int id){
        Subject subject = subjectRepository.findByIdAndStatus(id,1);
        return subject != null;
    }

    @Override
    public List<Chapter> getAllChaptersBySubjectId(int subjectId) {
        return chapterRepository.findAllByStatusAndSubjectId(1, subjectId);
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
        Subject subject = subjectRepository.findByIdAndStatus(chapterRequest.getSubjectId(),1);
        chapter.setSubject(subject);
        chapter.setStatus(1);
        return chapterRepository.save(chapter);
    }


    @Override
    public Chapter updateChapter(int id, ChapterRequest chapterRequest) {
        Chapter oldChapter = chapterRepository.findById(id).orElseThrow(() -> new NotFoundException("NotFoundChapter", "Chapter not found"));
        if (ExistChapterName(chapterRequest.getName()) && !oldChapter.getName().equals(chapterRequest.getName())) {
            throw new AlreadyExistException("ExistChapter", "Chapter name already exists");
        }
        if (!ExistSubjectId(chapterRequest.getSubjectId())) {
            throw new NotFoundException("NotFoundSubject", "Subject id not found");
        }
        oldChapter.setName(chapterRequest.getName());
        Subject subject = subjectRepository.findByIdAndStatus(chapterRequest.getSubjectId(),1);
        oldChapter.setSubject(subject);
        return chapterRepository.save(oldChapter);
    }

    @Override
    public Chapter deleteChapter(int id) {
        Chapter oldChapter = chapterRepository.findByIdAndStatus(id,1);
        oldChapter.setStatus(0);
        return chapterRepository.save(oldChapter);
    }
}
