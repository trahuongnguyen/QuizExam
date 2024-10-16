package com.example.quizexam_student.bean.request;

import com.example.quizexam_student.entity.Mark;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class StudentRequest {
    private UserRequest userRequest;
    @NotBlank(message = "Roll Portal is required")
    private String rollPortal;
    @NotBlank(message = "Roll Number is required")
    private String rollNumber;
    private int statusId;
    private int classId;
    private List<Mark> marks;
}
