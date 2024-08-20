package com.example.quizexam_student.service.impl;

import com.example.quizexam_student.entity.Role;
import com.example.quizexam_student.repository.RoleRepository;
import com.example.quizexam_student.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {
    private final RoleRepository roleRepository;
    @Override
    public Role findByRoleName(String roleName) {
        return roleRepository.findByName(roleName).orElse(null);
    }
}
