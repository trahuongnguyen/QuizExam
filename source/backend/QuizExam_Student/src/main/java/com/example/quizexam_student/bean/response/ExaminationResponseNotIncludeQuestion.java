package com.example.quizexam_student.bean.response;

import com.example.quizexam_student.entity.Subject;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ExaminationResponseNotIncludeQuestion {
    private int id;
    private String name;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer duration;
    private String code;
    private Subject subject;
}
