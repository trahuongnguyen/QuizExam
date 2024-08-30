package com.example.quizexam_student.controller;

import com.example.quizexam_student.bean.request.PasswordRequest;
import com.example.quizexam_student.bean.request.UserRequest;
import com.example.quizexam_student.bean.response.UserResponse;
import com.example.quizexam_student.entity.Role;
import com.example.quizexam_student.service.RoleService;
import com.example.quizexam_student.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@Validated
public class UserController {
    private final UserService userService;
    private final RoleService roleService;

    @GetMapping("")
    public List<UserResponse> getAll(){
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserResponse getDetail(@PathVariable int id){
        return userService.getUserById(id);
    }

    @GetMapping("/profile/{id}")
    public UserResponse getProfile(@PathVariable int id){
        return userService.getUserById(id);
    }

    @PostMapping("/profile/{id}")
    public ResponseEntity<String> updateProfile(@PathVariable int id, @RequestBody @Valid PasswordRequest passwordRequest) {
        userService.changePassword(id, passwordRequest);
        return new ResponseEntity<>("Password updated successfully", HttpStatus.OK);
    }

    @GetMapping("/remove/{id}")
    public ResponseEntity<String> remove(@PathVariable int id){
        userService.deleteUserById(id);
        return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
    }
}
