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
import java.util.Objects;

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
        Subject subject = subjectRepository.findByIdAndStatus(chapterRequest.getSubjectId(),1);
        if (Objects.isNull(subject)) {
            throw new NotFoundException("NotFoundSubject", "Subject id not found");
        }
        Chapter checkChapter = chapterRepository.findByNameAndSubjectAndStatus(chapterRequest.getName(), subject, 1);
        if (!Objects.isNull(checkChapter)) {
            throw new AlreadyExistException("ExistChapter", "Chapter name already exists");
        }
        Chapter chapter = new Chapter();
        chapter.setName(chapterRequest.getName());
        chapter.setSubject(subject);
        chapter.setStatus(1);
        return chapterRepository.save(chapter);
    }


    @Override
    public Chapter updateChapter(int id, ChapterRequest chapterRequest) {
        Subject subject = subjectRepository.findByIdAndStatus(chapterRequest.getSubjectId(),1);
        if (Objects.isNull(subject)) {
            throw new NotFoundException("NotFoundSubject", "Subject id not found");
        }
        Chapter oldChapter = chapterRepository.findById(id).orElseThrow(() -> new NotFoundException("NotFoundChapter", "Chapter not found"));
        Chapter chapter = chapterRepository.findByNameAndSubjectAndStatusAndIdNot(chapterRequest.getName(), subject, 1, id);
        if (!Objects.isNull(chapter)) {
            throw new AlreadyExistException("ExistChapter", "Chapter name already exists");
        }
        oldChapter.setName(chapterRequest.getName());
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
