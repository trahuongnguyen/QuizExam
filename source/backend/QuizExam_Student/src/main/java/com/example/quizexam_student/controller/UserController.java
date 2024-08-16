package com.example.quizexam_student.controller;

import com.example.quizexam_student.bean.request.UserRequest;
import com.example.quizexam_student.bean.response.UserResponse;
import com.example.quizexam_student.repository.UserRepository;
import com.example.quizexam_student.service.UserService;
import com.example.quizexam_student.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final JwtUtil jwtUtil;

    private AuthenticationManager authenticationManager;

    @PostMapping
    public ResponseEntity<UserResponse> login(@RequestBody UserRequest userRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userRequest.getEmail(), userRequest.getPassword()));
        String token = jwtUtil.generateToken(userRequest.getEmail());
        return ResponseEntity.ok(new UserResponse(token, "Token generated successfully"));
    }

    @PostMapping("/getData")
    public ResponseEntity<String> testAfterLogin(Principal principal) {
        return ResponseEntity.ok("You are accessing data after a valid login. You are :"+ principal.getName());
    }
}
