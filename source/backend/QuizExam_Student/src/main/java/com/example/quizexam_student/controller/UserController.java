package com.example.quizexam_student.controller;

import com.example.quizexam_student.bean.request.PasswordRequest;
import com.example.quizexam_student.bean.response.EmpExcelExporter;
import com.example.quizexam_student.bean.response.EmpPDFExporter;
import com.example.quizexam_student.bean.response.UserResponse;
import com.example.quizexam_student.entity.Role;
import com.example.quizexam_student.service.RoleService;
import com.example.quizexam_student.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("")
    public List<UserResponse> getAll(){
        String email = ((org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        Role role = userService.findUserByEmail(email).getRole();
        List<Role> roles = roleService.findAllByPermission(role.getId());
        if(roles!=null){
            List<UserResponse> users = new ArrayList<>();
            roles.forEach(role1 -> {
                users.addAll(userService.getUserByRolePermission(role1));
            });
            return users;
        }
        return null;
    }

    @GetMapping("/{id}")
    public UserResponse getDetail(@PathVariable int id){
        return userService.getUserById(id);
    }


    @GetMapping("/remove/{id}")
    public ResponseEntity<String> remove(@PathVariable int id){
        userService.deleteUserById(id);
        return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
    }

//    @GetMapping("/export/excel")
//    public ResponseEntity<String> exportToExcel(HttpServletResponse response) throws IOException {
//        response.setContentType("application/octet-stream");
//        String headerKey = "Content-Disposition";
//        DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
//        String currentDateTime = dateFormat.format(new Date());
//        String fileName = "users_" + currentDateTime + ".xlsx";
//        String headerValue = "attachment; filename=" + fileName;
//        response.setHeader(headerKey, headerValue);
//        List<UserResponse> users = userService.getUserByRolePermission();
//        EmpExcelExporter excelExporter = new EmpExcelExporter(users);
//        excelExporter.export(response);
//        return new ResponseEntity<>("Export To Excel Successfully", HttpStatus.OK);
//    }
//
//    @GetMapping(value = "/export/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
//    public ResponseEntity<String> exportToPDF(HttpServletResponse response) throws IOException {
//        response.setContentType("application/pdf");
//        String headerKey = "Content-Disposition";
//        DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
//        String currentDateTime = dateFormat.format(new Date());
//        String fileName = "users_" + currentDateTime + ".pdf";
//        String headerValue = "attachment; filename=" + fileName;
//        response.setHeader(headerKey, headerValue);
//        List<UserResponse> users = userService.getUserByRolePermission();
//        EmpPDFExporter userPDFExporter = new EmpPDFExporter(users);
//        userPDFExporter.export(response);
//        return new ResponseEntity<>("Export To PDF Successfully", HttpStatus.OK);
//    }
}
