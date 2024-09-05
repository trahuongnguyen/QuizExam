package com.example.quizexam_student.controller;

import com.example.quizexam_student.bean.request.LoginRequest;
import com.example.quizexam_student.bean.request.UserRequest;
import com.example.quizexam_student.bean.response.LoginResponse;
import com.example.quizexam_student.bean.response.RegisterResponse;
import com.example.quizexam_student.entity.Role;
import com.example.quizexam_student.service.RoleService;
import com.example.quizexam_student.service.UserService;
import com.example.quizexam_student.util.JwtUtil;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@Validated
public class AuthController {
    private final UserService userService;
    private final RoleService roleService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final HttpSession httpSession;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtUtil.generateJwtToken(authentication);
        return ResponseEntity.ok(new LoginResponse(token, loginRequest.getEmail()));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('DIRECTOR') or hasRole('SRO')")
    @GetMapping("/register")
    public List<Role> register() {
        String email = ((org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        Role role = userService.findUserByEmail(email).getRole();
        List<Role> roles = roleService.findAllByPermission(role.getId());
        return roles;
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('DIRECTOR') or hasRole('SRO')")
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody @Valid UserRequest userRequest) {
        userService.saveUser(userRequest);
        return ResponseEntity.ok(new RegisterResponse(userRequest.getEmail(), userRequest.getPassword()));
    }
}
