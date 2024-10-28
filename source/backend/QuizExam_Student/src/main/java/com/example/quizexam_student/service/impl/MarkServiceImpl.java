package com.example.quizexam_student.service.impl;

import com.example.quizexam_student.entity.Mark;
import com.example.quizexam_student.entity.StudentDetail;
import com.example.quizexam_student.repository.MarkRepository;
import com.example.quizexam_student.service.MarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MarkServiceImpl implements MarkService {
    private final MarkRepository markRepository;
    @Override
    public List<Mark> getListScoredBySubject(StudentDetail studentDetail) {
        List<Mark> marks = markRepository.findAllByStudentDetailAndScoreIsNotNull(studentDetail);
        Map<Integer, Mark> latestMarks = new HashMap<>();
        for (Mark mark : marks) {
            Integer key = mark.getSubject().getId();
            if (!latestMarks.containsKey(key)
                    || mark.getBeginTime().isAfter(latestMarks.get(key).getBeginTime()) ) {
                latestMarks.put(key, mark);
            }
        }
        return new ArrayList<>(latestMarks.values());
    }

    @Override
    public Mark getOneScoredByExam(StudentDetail studentDetail, int examId) {
        return markRepository.findByStudentDetailAndExaminationId(studentDetail, examId);
    }
}
