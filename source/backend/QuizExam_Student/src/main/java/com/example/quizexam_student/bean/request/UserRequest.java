package com.example.quizexam_student.bean.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UserRequest {
    private String fullName;
    private String email;
    private String password;
    private LocalDate dob;
    private String phoneNumber;
    private String address;
    private int gender;
}
