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

import java.math.BigDecimal;
import java.math.RoundingMode;
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
    public List<Map<String, Object>> getPassPercentageBySubject() {
        // Lấy tất cả các điểm (mark) có score khác null
        List<Mark> marks = markRepository.findAllByScoreIsNotNull();

        // Nhóm các điểm theo subjectName, tính tổng điểm, tổng maxScore, và số lượng bài pass
        Map<String, Integer> subjectTotalScore = new HashMap<>();
        Map<String, Integer> subjectTotalMaxScore = new HashMap<>();
        Map<String, Integer> subjectPassCount = new HashMap<>();
        Map<String, Integer> subjectTotalExams = new HashMap<>();

        // Lặp qua tất cả các mark để tính tổng score, tổng maxScore và số lượng bài pass
        for (Mark mark : marks) {
            String subjectName = mark.getSubject().getName();

            // Cộng dồn tổng score theo môn học
            subjectTotalScore.put(subjectName, subjectTotalScore.getOrDefault(subjectName, 0) + mark.getScore());

            // Cộng dồn tổng maxScore theo môn học từ kỳ thi
            subjectTotalMaxScore.put(subjectName, subjectTotalMaxScore.getOrDefault(subjectName, 0) + mark.getExamination().getMaxScore());

            // Cộng dồn số bài thi đã pass theo môn học
            double passPercentage = (double) mark.getScore() / mark.getExamination().getMaxScore() * 100;
            if (passPercentage >= 40) {
                subjectPassCount.put(subjectName, subjectPassCount.getOrDefault(subjectName, 0) + 1);
            }

            // Cộng dồn tổng số bài thi của môn học
            subjectTotalExams.put(subjectName, subjectTotalExams.getOrDefault(subjectName, 0) + 1);
        }

        // Tạo danh sách kết quả cuối cùng
        List<Map<String, Object>> result = new ArrayList<>();

        // Duyệt qua các môn học và tạo đối tượng chứa thông tin cần trả về
        for (String subjectName : subjectTotalScore.keySet()) {
            Map<String, Object> subjectStats = new HashMap<>();

            // Tính tỷ lệ pass
            int totalExams = subjectTotalExams.get(subjectName);
            int passCount = subjectPassCount.getOrDefault(subjectName, 0);
            double passRate = totalExams > 0 ? (double) passCount / totalExams * 100 : 0;
            BigDecimal passRateRounded = new BigDecimal(passRate).setScale(2, RoundingMode.HALF_UP);
            subjectStats.put("subjectName", subjectName);
            subjectStats.put("passRate", passRateRounded); // Tỷ lệ pass của môn học

            result.add(subjectStats);
        }

        return result;
    }

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