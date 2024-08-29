package com.example.quizexam_student.service.impl;

import com.example.quizexam_student.entity.Role;
import com.example.quizexam_student.exception.NotFoundException;
import com.example.quizexam_student.repository.RoleRepository;
import com.example.quizexam_student.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {
    private final RoleRepository roleRepository;
    @Override
    public List<Role> findByRoleName(String roleName) {
        return roleRepository.findByName(roleName);
    }
    @Override
    public Role findById(int id) {
        return roleRepository.findById(id).orElseThrow(() -> new NotFoundException("Role is not exist"));
    }

    @Override
    public List<Role> findAll(){
        return  roleRepository.findAll();
    }
}
