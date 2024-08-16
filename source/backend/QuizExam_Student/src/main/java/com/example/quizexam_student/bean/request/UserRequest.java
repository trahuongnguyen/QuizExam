package com.example.quizexam_student.bean.request;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class UserRequest {
    private String email;
    private String password;
}
