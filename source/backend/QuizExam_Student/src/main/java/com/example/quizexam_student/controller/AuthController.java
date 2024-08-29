package com.example.quizexam_student.controller;

import com.example.quizexam_student.bean.request.LoginRequest;
import com.example.quizexam_student.bean.request.UserRequest;
import com.example.quizexam_student.bean.response.LoginResponse;
import com.example.quizexam_student.entity.Role;
import com.example.quizexam_student.entity.User;
import com.example.quizexam_student.exception.IncorrectEmailOrPassword;
import com.example.quizexam_student.service.RoleService;
import com.example.quizexam_student.service.UserService;
import com.example.quizexam_student.util.JwtUtil;
import jakarta.persistence.Id;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.ui.Model;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtUtil.generateJwtToken(authentication);
        return ResponseEntity.ok(new LoginResponse(token, loginRequest.getEmail()));
    }

//    @GetMapping("/register/{Id}")
//    public String register(Model model, @PathVariable int Id) {
//        List<Role> role = new ArrayList<>();
//        if (roleService.findById(Id).getName().equals("DIRECTOR")){
//            role = roleService.findAll();
//        }
//        if (roleService.findById(Id).getName().equals("SRO")){
//            role = roleService.findByRoleName("STUDENT");
//        }
//        model.addAttribute("listRole", role);
//        return "register";
//    }
//
//    @PostMapping("/register")
//    public ResponseEntity<String> register(@RequestBody @Valid UserRequest userRequest) {
//        User user = userService.saveUser(userRequest);
//        return new ResponseEntity<>("Student registed successfully", HttpStatus.OK);
//    }
}
