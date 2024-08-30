package com.example.quizexam_student.service;

import com.example.quizexam_student.entity.Role;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface RoleService {
    List<Role> findByRoleName(String roleName);
    Role findById(int id);
    List<Role> findAll();
}
