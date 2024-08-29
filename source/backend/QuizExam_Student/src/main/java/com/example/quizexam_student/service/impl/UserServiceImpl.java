package com.example.quizexam_student.service.impl;

import com.example.quizexam_student.bean.request.PasswordRequest;
import com.example.quizexam_student.bean.request.UserRequest;
import com.example.quizexam_student.bean.response.UserResponse;
import com.example.quizexam_student.entity.Role;
import com.example.quizexam_student.entity.User;
import com.example.quizexam_student.exception.EmptyException;
import com.example.quizexam_student.mapper.*;
import com.example.quizexam_student.exception.DuplicatedEmailException;
import com.example.quizexam_student.exception.DuplicatedPhoneException;
import com.example.quizexam_student.exception.IncorrectEmailOrPassword;
import com.example.quizexam_student.repository.RoleRepository;
import com.example.quizexam_student.repository.UserRepository;
import com.example.quizexam_student.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

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
    public Boolean existUserByPhone(String phone) {
        User user = userRepository.findByPhoneNumber(phone).orElse(null);
        return user != null;
    }

    @Override
    public User saveUser(UserRequest userRequest) {
        if(existUserByEmail(userRequest.getEmail())){
            throw new DuplicatedEmailException("Email existed already");
        }
        if (existUserByPhone(userRequest.getPhoneNumber())) {
            throw new DuplicatedPhoneException("Phone number existed already");
        }
        User user = new User();
        user.setEmail(userRequest.getEmail());
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        user.setDob(userRequest.getDob());
        user.setGender(userRequest.getGender());
        user.setFullName(userRequest.getFullName());
        user.setAddress(userRequest.getAddress());
        user.setPhoneNumber(userRequest.getPhoneNumber());
        Role role = roleRepository.findById(userRequest.getRoleId()).orElse(null);
        user.setRole(role);
        user.setStatus(1);
        return userRepository.save(user);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        List<UserResponse> userResponses = userRepository.findAll().stream().map(UserMapper::convertToResponse).collect(Collectors.toList());
        if (userResponses.isEmpty()){
            throw new EmptyException("Employee List is null");
        }
        return userResponses;
    }

    @Override
    public UserResponse getUserById(int id) {
        return  UserMapper.convertToResponse(Objects.requireNonNull(userRepository.findById(id).orElse(null)));
    }

    @Override
    public void changePassword(int id, PasswordRequest passwordRequest) {
        User user = userRepository.findById(id).orElse(null);
        if (!passwordEncoder.matches(passwordRequest.getCurrentPassword(), user.getPassword())){
            throw new IncorrectEmailOrPassword("Your current password does not match");
        }
        if (passwordEncoder.matches(passwordRequest.getNewPassword(), user.getPassword())){
            throw new IncorrectEmailOrPassword("Your new password must different old password");
        }
        if (passwordRequest.getCurrentPassword().equals(passwordRequest.getNewPassword())){
            throw new IncorrectEmailOrPassword("Your new password must different current password");
        }
        if (!passwordRequest.getNewPassword().equals(passwordRequest.getConfirmPassword())){
            throw new IncorrectEmailOrPassword("Your confirm password does not match");
        }
        user.setPassword(passwordEncoder.encode(passwordRequest.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public void deleteUserById(int id) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            user.setStatus(0);
        }else{
            throw new EmptyException("Employee Detail is null");
        }
    }


}
