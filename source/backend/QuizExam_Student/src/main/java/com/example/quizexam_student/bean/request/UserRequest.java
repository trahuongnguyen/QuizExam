package com.example.quizexam_student.bean.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserRequest {
    @NotBlank(message = "Full Name is required")
    @Pattern(regexp="^[a-z A-Z]+$", message = "Full name cannot have number or special character")
    private String fullName;
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=.]).{8,}$",
            message = "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    private String password;
    @NotNull(message = "Date of Birth is required")
    //@Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "Date of birth must be in the format yyyy-MM-dd")
    @JsonFormat(pattern = "[yyyy-MM-dd][yyyy/MM/dd][dd-MM-yyyy][dd/MM/yyyy]")
    private LocalDate dob;
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be exactly 10 digits long")
    private String phoneNumber;
    @NotBlank(message = "Address is required")
    private String address;
    @NotNull(message = "Gender is required")
    private int gender;
    @NotNull(message = "Role is required")
    private int roleId;
}
