package com.example.quizexam_student.controller;

import com.example.quizexam_student.bean.request.PasswordRequest;
import com.example.quizexam_student.bean.response.UserResponse;
import com.example.quizexam_student.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@Validated
public class StudentController {
    private UserService userService;

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/profile/{id}")
    public UserResponse getProfile(@PathVariable int id){
        return userService.getUserById(id);
    }

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/profile/{id}")
    public ResponseEntity<String> updateProfile(@PathVariable int id, @RequestBody @Valid PasswordRequest passwordRequest) {
        userService.changePassword(id, passwordRequest);
        return new ResponseEntity<>("Password updated successfully", HttpStatus.OK);
    }
}
