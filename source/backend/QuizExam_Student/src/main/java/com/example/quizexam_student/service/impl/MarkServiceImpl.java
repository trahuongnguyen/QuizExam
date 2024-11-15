package com.example.quizexam_student.service.impl;

import com.example.quizexam_student.bean.response.MarkResponse;
import com.example.quizexam_student.entity.Mark;
import com.example.quizexam_student.entity.StudentDetail;
import com.example.quizexam_student.entity.User;
import com.example.quizexam_student.exception.IncorrectEmailOrPassword;
import com.example.quizexam_student.exception.NotFoundException;
import com.example.quizexam_student.mapper.MarkMapper;
import com.example.quizexam_student.repository.MarkRepository;
import com.example.quizexam_student.repository.SubjectRepository;
import com.example.quizexam_student.repository.UserRepository;
import com.example.quizexam_student.service.MarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MarkServiceImpl implements MarkService {
    private final MarkRepository markRepository;

    private final SubjectRepository subjectRepository;

    private final UserRepository userRepository;

    @Override
    public List<MarkResponse> getListScoredPerSubject(StudentDetail studentDetail, int semId) {
        List<MarkResponse> marks = markRepository.findAllByStudentDetailAndScoreIsNotNull(studentDetail)
                .stream().map(MarkMapper::convertToResponse).collect(Collectors.toList());
        Map<String, MarkResponse> latestMarks = new HashMap<>();
        for (MarkResponse mark : marks) {
            String key = mark.getSubjectName();
            if (!latestMarks.containsKey(key) || mark.getBeginTime().isAfter(latestMarks.get(key).getBeginTime())) {
                latestMarks.put(key, mark);
            }
        }
        return new ArrayList<>(latestMarks.values())
                .stream()
                .filter(m -> subjectRepository.findByName(m.getSubjectName()).getSem().getId() == semId)
                .collect(Collectors.toList());
    }

    @Override
    public MarkResponse getOneScoredByExam(StudentDetail studentDetail, int examId) {
        return MarkMapper.convertToResponse(markRepository.findByStudentDetailAndExaminationId(studentDetail, examId));
    }

    @Override
    public Mark updateBeginTime(int id) {
        User user = getUserByEmail();
        Mark mark = markRepository.findById(id).orElse(null);
        if (Objects.isNull(mark) || mark.getStudentDetail().getUserId() != user.getId() || mark.getBeginTime() != null) {
            throw new NotFoundException("mark", "Mark not found.");
        }
        mark.setBeginTime(LocalDateTime.now());
        return markRepository.save(mark);
    }

    @Override
    public Mark updateWarning(int id, Mark markInput) {
        User user = getUserByEmail();
        Mark mark = markRepository.findById(id).orElse(null);
        if (Objects.isNull(mark) || mark.getStudentDetail().getUserId() != user.getId() || mark.getScore() != null) {
            throw new NotFoundException("mark", "Mark not found.");
        }
        mark.setWarning(markInput.getWarning());
        return markRepository.save(mark);
    }

    public User getUserByEmail() {
        String email = ((org.springframework.security.core.userdetails.User)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email).orElse(null);
        if (Objects.isNull(user)) {
            throw new IncorrectEmailOrPassword("email", "Your Email Not Found");
        }
        return user;
    }
}