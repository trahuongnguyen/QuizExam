package com.example.quizexam_student.controller;

import com.example.quizexam_student.bean.request.PasswordRequest;
import com.example.quizexam_student.bean.request.UserRequest;
import com.example.quizexam_student.bean.response.EmpExcelExporter;
import com.example.quizexam_student.bean.response.EmpPDFExporter;
import com.example.quizexam_student.bean.response.UserResponse;
import com.example.quizexam_student.entity.Role;
import com.example.quizexam_student.entity.User;
import com.example.quizexam_student.exception.EmptyException;
import com.example.quizexam_student.mapper.UserMapper;
import com.example.quizexam_student.service.ExportService;
import com.example.quizexam_student.service.RoleService;
import com.example.quizexam_student.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@Validated
public class UserController {
    private final UserService userService;
    private final RoleService roleService;
    private final ExportService exportService;

    @PreAuthorize("hasAnyRole('ADMIN','DIRECTOR','SRO')")
    @GetMapping("")
    public List<UserResponse> getAll(){
        String email = ((org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        Role role = userService.findUserByEmail(email).getRole();
        System.out.println(role);
        List<Role> roles = roleService.findAllByPermission(role.getId());
        if(roles!=null){
            List<UserResponse> users = new ArrayList<>();
            roles.forEach(role1 -> {
                System.out.println(role1);
                users.addAll(userService.getUserByRolePermission(role1));
            });
            if (users.isEmpty()){
                if (role.getName().equals("SRO")){
                    throw new EmptyException("student", "Student List is null");
                } else {
                    throw new EmptyException("employee", "Employee List is empty");
                }
            }
            return users;
        }
        return null;
    }

    @GetMapping("/profile")
    public UserResponse getDetail(){
        String email = ((org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        return UserMapper.convertToResponse(userService.findUserByEmail(email));
    }


    @GetMapping("/remove/{id}")
    public ResponseEntity<String> remove(@PathVariable int id){
        userService.deleteUserById(id);
        return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('DIRECTOR') or hasRole('SRO') or hasRole('TEACHER')")
    @PostMapping("/update/{id}")
    public ResponseEntity<User> updateUser(@PathVariable int id, @RequestBody @Valid UserRequest userRequest) {
        return ResponseEntity.ok(userService.updateUser(id, userRequest));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('DIRECTOR') or hasRole('SRO')  or hasRole('TEACHER') or hasRole('STUDENT')")
    @PostMapping("/changePassword/{id}")
    public ResponseEntity<User> updateProfile(@PathVariable int id, @RequestBody @Valid PasswordRequest passwordRequest) {
        return ResponseEntity.ok(userService.changePassword(id, passwordRequest));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('DIRECTOR') or hasRole('SRO')")
    @GetMapping("/export/excel")
    public ResponseEntity<String> exportToExcel(HttpServletResponse response) throws IOException {
        exportService.export(response, "user", "xlsx");
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
        exportService.export(response, "user", "pdf");
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
