package com.example.quizexam_student.controller;

import com.example.quizexam_student.bean.response.MarkResponse;
import com.example.quizexam_student.entity.Mark;
import com.example.quizexam_student.entity.User;
import com.example.quizexam_student.mapper.MarkMapper;
import com.example.quizexam_student.service.MarkService;
import com.example.quizexam_student.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mark")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class MarkController {
    private final MarkService markService;

    private final UserService userService;

    @GetMapping("/pass-percentage")
    public List<Map<String, Object>> getPassPercentageBySubject() {
        return markService.getPassPercentageBySubject();
    }

    @GetMapping("/sem/{semId}")
    public List<MarkResponse> getAllMarksByStudentDetailAndScoreNotNull(@PathVariable int semId){
        String email = ((org.springframework.security.core.userdetails.User)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User user = userService.findUserByEmail(email);
        return markService.getListScoredPerSubject(user.getStudentDetail(), semId);
    }

    @GetMapping("/{examId}")
    public MarkResponse getOneScoreByExam(@PathVariable int examId){
        String email = ((org.springframework.security.core.userdetails.User)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User user = userService.findUserByEmail(email);
        return markService.getOneScoredByExam(user.getStudentDetail(), examId);
    }

    @PutMapping("/begin-time/{id}")
    public MarkResponse updateBeginTime(@PathVariable int id) {
        return MarkMapper.convertToResponse(markService.updateBeginTime(id));
    }

    @PutMapping("/warning/{id}")
    public MarkResponse updateWarning(@PathVariable int id, @RequestBody @Valid Mark mark) {
        return MarkMapper.convertToResponse(markService.updateWarning(id, mark));
    }
}
