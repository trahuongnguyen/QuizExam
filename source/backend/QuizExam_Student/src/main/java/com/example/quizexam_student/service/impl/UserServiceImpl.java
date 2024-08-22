package com.example.quizexam_student.service.impl;

import com.example.quizexam_student.bean.request.UserRequest;
import com.example.quizexam_student.entity.Role;
import com.example.quizexam_student.entity.User;
import com.example.quizexam_student.exception.DuplicatedException;
import com.example.quizexam_student.exception.IncorrectEmailOrPassword;
import com.example.quizexam_student.repository.RoleRepository;
import com.example.quizexam_student.repository.UserRepository;
import com.example.quizexam_student.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new IncorrectEmailOrPassword("Your Email Not Found"));
    }

    @Override
    public Boolean existUserByEmail(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        return user != null;
    }

    @Override
    public User saveUser(UserRequest userRequest) {
        if(existUserByEmail(userRequest.getEmail())){
            throw new DuplicatedException("Email existed already");
        }
        User user = new User();
        user.setEmail(userRequest.getEmail());
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        user.setDob(userRequest.getDob());
        user.setGender(userRequest.getGender());
        user.setFullName(userRequest.getFullName());
        user.setAddress(userRequest.getAddress());
        user.setPhoneNumber(userRequest.getPhoneNumber());
        Role role = roleRepository.findByName("STUDENT").orElse(null);
        user.setRole(role);
        return userRepository.save(user);
    }
}
