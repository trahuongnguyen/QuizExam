package com.example.quizexam_student.controller;

import com.example.quizexam_student.bean.request.LoginRequest;
import com.example.quizexam_student.bean.request.PasswordRequest;
import com.example.quizexam_student.bean.request.UserRequest;
import com.example.quizexam_student.bean.response.*;
import com.example.quizexam_student.entity.Role;
import com.example.quizexam_student.entity.User;
import com.example.quizexam_student.exception.IncorrectEmailOrPassword;
import com.example.quizexam_student.service.RoleService;
import com.example.quizexam_student.service.UserService;
import com.example.quizexam_student.util.JwtUtil;
import jakarta.persistence.Id;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
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

    @PreAuthorize("hasAnyRole('ADMIN','DIRECTOR','SRO')")
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

    @PreAuthorize("hasRole('ADMIN') or hasRole('DIRECTOR') or hasRole('SRO')  or hasRole('TEACHER')")
    @GetMapping("/update/{id}")
    public User updateUser(@PathVariable int id) {
        return userService.findById(id);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('DIRECTOR') or hasRole('SRO') or hasRole('TEACHER')")
    @PostMapping("/update/{id}")
    public ResponseEntity<String> updateUser(@PathVariable int id, @RequestBody @Valid UserRequest userRequest) {
        userService.updateUser(id, userRequest);
        return new ResponseEntity("Update User Success", HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('DIRECTOR') or hasRole('SRO')  or hasRole('TEACHER')")
    @GetMapping("/profile/{id}")
    public UserResponse getProfile(@PathVariable int id){
        return userService.getUserById(id);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('DIRECTOR') or hasRole('SRO')  or hasRole('TEACHER')")
    @PostMapping("/profile/{id}")
    public ResponseEntity<String> updateProfile(@PathVariable int id, @RequestBody @Valid PasswordRequest passwordRequest) {
        userService.changePassword(id, passwordRequest);
        return new ResponseEntity<>("Password updated successfully", HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('DIRECTOR') or hasRole('SRO')")
    @GetMapping("/export/excel")
    public ResponseEntity<String> exportToExcel(HttpServletResponse response) throws IOException {
        response.setContentType("application/octet-stream");
        String headerKey = "Content-Disposition";
        DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        String currentDateTime = dateFormat.format(new Date());
        String fileName = "users_" + currentDateTime + ".xlsx";
        String headerValue = "attachment; filename=" + fileName;
        response.setHeader(headerKey, headerValue);
        String email = ((org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        Role role = userService.findUserByEmail(email).getRole();
        List<Role> roles = roleService.findAllByPermission(role.getId());
        List<UserResponse> users = new ArrayList<>();
        roles.forEach(role1 -> {
            users.addAll(userService.getUserByRolePermission(role1));
        });
        EmpExcelExporter excelExporter = new EmpExcelExporter(users);
        excelExporter.export(response);
        return new ResponseEntity<>("Export To Excel Successfully", HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('DIRECTOR') or hasRole('SRO')")
    @GetMapping(value = "/export/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<String> exportToPDF(HttpServletResponse response) throws IOException {
        response.setContentType("application/pdf");
        String headerKey = "Content-Disposition";
        DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        String currentDateTime = dateFormat.format(new Date());
        String fileName = "users_" + currentDateTime + ".pdf";
        String headerValue = "attachment; filename=" + fileName;
        response.setHeader(headerKey, headerValue);
        String email = ((org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        Role role = userService.findUserByEmail(email).getRole();
        List<Role> roles = roleService.findAllByPermission(role.getId());
        List<UserResponse> users = new ArrayList<>();
        roles.forEach(role1 -> {
            users.addAll(userService.getUserByRolePermission(role1));
        });
        EmpPDFExporter userPDFExporter = new EmpPDFExporter(users);
        userPDFExporter.export(response);
        return new ResponseEntity<>("Export To PDF Successfully", HttpStatus.OK);
    }
}
