package com.example.quizexam_student.bean.response;

import com.example.quizexam_student.entity.Classes;
import com.example.quizexam_student.entity.Mark;
import com.example.quizexam_student.entity.Role;
import com.example.quizexam_student.entity.Status;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private int id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String address;
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate dob;
    private int gender;
    private Role role;
    private String rollPortal;
    private String rollNumber;
    @JsonIgnore
    private Status status;
    private Classes _class;
    private List<Mark> marks;
}
