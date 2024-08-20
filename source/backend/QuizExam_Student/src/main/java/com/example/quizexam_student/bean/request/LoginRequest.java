package com.example.quizexam_student.bean.request;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
