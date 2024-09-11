package com.example.quizexam_student.bean.request;

import com.example.quizexam_student.entity.Sem;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SubjectRequest {
    private int id;
    @NotBlank(message = "Subject name is required")
    private String name;
    private byte[] image;
    @NotBlank(message = "Semeter is required")
    private int semId;
}
