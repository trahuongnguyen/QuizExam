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

    @GetMapping("/{Id}")
    public UserResponse getDetail(@PathVariable int Id){
        return userService.getUserById(Id);
    }

    @GetMapping("/register")
    public void register(Model model) {
        List<Role> role = roleService.findAll();
//        if (roleService.findById(Id).getName().equals("DIRECTOR")){
//            role = roleService.findAll();
//        }
//        if (roleService.findById(Id).getName().equals("SRO")){
//            role = roleService.findByRoleName("STUDENT");
//        }
        model.addAttribute("listRole", role);
//        return "register";
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody @Valid UserRequest userRequest) {
        userService.saveUser(userRequest);
        return new ResponseEntity<>("User registed successfully", HttpStatus.OK);
    }

    @GetMapping("/profile/{Id}")
    public UserResponse getProfile(@PathVariable int Id){
        return userService.getUserById(Id);
    }

    @PostMapping("/profile/{Id}")
    public ResponseEntity<String> updateProfile(@PathVariable int Id, @RequestBody @Valid PasswordRequest passwordRequest) {
        userService.changePassword(Id, passwordRequest);
        return new ResponseEntity<>("Password updated successfully", HttpStatus.OK);
    }

    @GetMapping("/remove/{Id}")
    public ResponseEntity<String> remove(@PathVariable int Id){
        userService.deleteUserById(Id);
        return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
    }
}
