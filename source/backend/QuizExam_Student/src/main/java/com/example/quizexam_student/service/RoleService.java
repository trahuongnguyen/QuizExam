package com.example.quizexam_student.service;

import com.example.quizexam_student.entity.Role;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface RoleService {
    Role findByRoleName(String roleName);
    Role findById(int id);
    List<Role> findAll();
    List<Role> findAllByPermission(int id);
}
