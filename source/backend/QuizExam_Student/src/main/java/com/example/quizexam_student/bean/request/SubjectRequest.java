package com.example.quizexam_student.bean.request;

import com.example.quizexam_student.entity.Sem;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SubjectRequest {
    private int id;
    @NotBlank(message = "Subject name is required")
    private String name;
    private String image;
    @NotNull(message = "Semeter is required")
    private int semId;
}
