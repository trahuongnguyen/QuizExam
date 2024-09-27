package com.example.quizexam_student.bean.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChapterRequest {
    @NotBlank(message = "Chapter name is required")
    private String name;
    @NotNull(message = "Subject is required")
    private Integer subjectId;
}
