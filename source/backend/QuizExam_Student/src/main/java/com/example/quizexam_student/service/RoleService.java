package com.example.quizexam_student.service;

import com.example.quizexam_student.entity.Role;
import org.springframework.stereotype.Service;

@Service
public interface RoleService {
    Role findByRoleName(String roleName);
}
