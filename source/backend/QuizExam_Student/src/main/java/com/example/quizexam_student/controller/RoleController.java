package com.example.quizexam_student.controller;

import com.example.quizexam_student.entity.Role;
import com.example.quizexam_student.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/role")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@Validated
public class RoleController {
    private final RoleService roleService;

    @GetMapping
    public List<Role> getAllRoles() {
        return roleService.findAll();
    }

    @GetMapping("/{id}")
    public Role getRoleById(@PathVariable int id) {
        return roleService.findById(id);
    }

    @GetMapping("/ /{id}")
    public List<Role> getRolesByPermissionId(@PathVariable int id) {
        return roleService.findAllByPermissionToEmployee(id);
    }
}
