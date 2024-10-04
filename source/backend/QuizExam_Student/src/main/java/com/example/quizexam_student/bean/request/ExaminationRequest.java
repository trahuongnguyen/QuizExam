package com.example.quizexam_student.bean.request;

import com.example.quizexam_student.entity.Question;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ExaminationRequest {
    private String name;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer duration;
    private int subjectId;
    private List<Integer> chapterIds;
    private List<Integer> studentIds;
}
