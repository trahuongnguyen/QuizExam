package com.example.quizexam_student.bean.request;

import com.example.quizexam_student.entity.Question;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ExaminationRequest {
    @NotBlank(message = "Exam name is required")
    private String name;
    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;
    @NotNull(message = "End time is required")
    private LocalDateTime endTime;
    @NotBlank(message = "Duration is required")
    private Integer duration;
    @NotNull(message = "Subject is required")
    private int subjectId;
    private List<Integer> chapterIds;
    private List<Integer> studentIds;
    private List<Integer> classesIds;
}
