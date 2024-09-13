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
        return userRepository.findByEmail(email).orElseThrow(() -> new IncorrectEmailOrPassword("email", "Your Email Not Found"));
    }

    @Override
    public User findById(int id) {
        return userRepository.findById(id).orElseThrow(() -> new EmptyException("user", "User Not Found"));
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
            throw new DuplicatedEmailException("email", "Email existed already");
        }
        if (existUserByPhone(userRequest.getPhoneNumber())) {
            throw new DuplicatedPhoneException("phoneNumber", "Phone number existed already");
        }
        User user = new User();
        user = UserMapper.convertFromRequest(userRequest);
        user.setPassword(passwordEncoder.encode("@1234567"));
        Role role = roleRepository.findById(userRequest.getRoleId()).orElse(null);
        user.setRole(role);
        user.setStatus(1);
        return userRepository.saveAndFlush(user);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        List<UserResponse> userResponses = userRepository.findAll().stream().map(UserMapper::convertToResponse).collect(Collectors.toList());
        if (userResponses.isEmpty()){
            throw new EmptyException("employees", "Employee List is null");
        }
        return userResponses;
    }

    @Override
    public List<UserResponse> getUserByRolePermission(Role role) {
        List<UserResponse> userResponses = userRepository.findByRole(role).stream().map(UserMapper::convertToResponse).collect(Collectors.toList());
        return userResponses;
    }

    @Override
    public UserResponse getUserById(int id) {
        return  UserMapper.convertToResponse(Objects.requireNonNull(userRepository.findById(id).orElse(null)));
    }

    @Override
    public User changePassword(int id, PasswordRequest passwordRequest) {
        User user = userRepository.findById(id).orElse(null);
        if (!passwordEncoder.matches(passwordRequest.getCurrentPassword(), user.getPassword())){
            throw new IncorrectEmailOrPassword("password", "Your current password does not match");
        }
        if (passwordEncoder.matches(passwordRequest.getNewPassword(), user.getPassword())){
            throw new IncorrectEmailOrPassword("password", "Your new password must different old password");
        }
        if (!passwordRequest.getNewPassword().equals(passwordRequest.getConfirmPassword())){
            throw new IncorrectEmailOrPassword("password", "Your confirm password does not match");
        }
        user.setPassword(passwordEncoder.encode(passwordRequest.getNewPassword()));
        return userRepository.save(user);
    }

    @Override
    public void deleteUserById(int id) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            user.setStatus(0);
        }else{
            throw new EmptyException("employee", "Employee Detail is null");
        }
        userRepository.save(user);
    }

    @Override
    public User updateUser(int id, UserRequest userRequest) {
        User user = findById(id);
        if (existUserByPhone(userRequest.getPhoneNumber()) && !userRequest.getPhoneNumber().equals(user.getPhoneNumber())) {
            throw new DuplicatedPhoneException("phoneNumber", "Phone number existed already");
        }
        user = UserMapper.convertFromRequest(userRequest);
        user.setId(id);
        return userRepository.save(user);
    }
}
