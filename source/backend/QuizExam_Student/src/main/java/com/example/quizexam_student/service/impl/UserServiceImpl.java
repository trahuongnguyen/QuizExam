package com.example.quizexam_student.service.impl;

import com.example.quizexam_student.bean.request.*;
import com.example.quizexam_student.bean.response.UserResponse;
import com.example.quizexam_student.entity.*;
import com.example.quizexam_student.mapper.*;
import com.example.quizexam_student.exception.*;
import com.example.quizexam_student.repository.*;
import com.example.quizexam_student.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
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
        return userRepository.findByEmailAndStatus(email, 1).orElseThrow(() -> new IncorrectEmailOrPassword("email", "Your Email Not Found"));
    }

    @Override
    public User findById(int id) {
        User user = userRepository.findByIdAndStatus(id,1);
        if (Objects.isNull(user)) {
            throw new NotFoundException("user", "User not found.");
        }
        return user;
    }

    private void handleUserExist(User user, String key, String message) {
        if (user.getStatus() == 0) {
            throw new AlreadyExistException("restore", message + " already exists, but the user is hidden. Would you like to view this user to restore?");
        }
        throw new AlreadyExistException(key, message + " already exists.");
    }

    @Override
    public User saveUser(UserRequest userRequest) {
        User findByEmail = userRepository.findByEmail(userRequest.getEmail()).orElse(null);
        if (!Objects.isNull(findByEmail)) {
            handleUserExist(findByEmail, "email", "Email");
        }
        User findByPhoneNumber = userRepository.findByPhoneNumber(userRequest.getPhoneNumber()).orElse(null);
        if (!Objects.isNull(findByPhoneNumber)) {
            handleUserExist(findByPhoneNumber, "phoneNumber", "Phone Number");
        }

        Role role = roleRepository.findById(userRequest.getRoleId()).orElse(null);
        User user = UserMapper.convertFromRequest(userRequest);
        user.setPassword(passwordEncoder.encode("@1234567"));
        user.setRole(role);
        user.setStatus(1);
        return userRepository.saveAndFlush(user);
    }

    @Override
    public User updateUser(int id, UserRequest userRequest) {
        User user = findById(id);

        User findByEmail = userRepository.findByEmailAndIdNot(userRequest.getEmail(), id).orElse(null);
        if (!Objects.isNull(findByEmail)) {
            handleUserExist(findByEmail, "email", "Email");
        }
        User findByPhoneNumber = userRepository.findByPhoneNumberAndIdNot(userRequest.getPhoneNumber(), id).orElse(null);
        if (!Objects.isNull(findByPhoneNumber)) {
            handleUserExist(findByPhoneNumber, "phoneNumber", "Phone Number");
        }

        Role role = roleRepository.findById(userRequest.getRoleId()).orElse(null);
        String currentPassword = user.getPassword();
        user = UserMapper.convertFromRequest(userRequest);
        user.setPassword(currentPassword);
        user.setRole(role);
        user.setStatus(1);
        user.setId(id);
        return userRepository.save(user);
    }

    @Override
    public List<UserResponse> getUserByRolePermission(Role role, Integer status) {
        return userRepository.findByRoleAndStatus(role, status).stream().map(UserMapper::convertToResponse).collect(Collectors.toList());
    }

    @Override
    public User changePassword(PasswordRequest passwordRequest) {
        String email = ((org.springframework.security.core.userdetails.User)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User user = findUserByEmail(email);
        assert user != null;
        if (!passwordEncoder.matches(passwordRequest.getCurrentPassword(), user.getPassword())){
            throw new IncorrectEmailOrPassword("password", "Your current password does not match");
        }
        if (passwordEncoder.matches(passwordRequest.getNewPassword(), user.getPassword())){
            throw new IncorrectEmailOrPassword("password", "Your new password must different current password");
        }
        if (!passwordRequest.getNewPassword().equals(passwordRequest.getConfirmPassword())){
            throw new IncorrectEmailOrPassword("password", "Your confirm password does not match");
        }
        user.setPassword(passwordEncoder.encode(passwordRequest.getNewPassword()));
        return userRepository.save(user);
    }

    @Override
    public User deleteUserById(int id) {
        User user = userRepository.findByIdAndStatus(id,1);
        if (user != null) {
            user.setStatus(0);
        }
        else {
            throw new EmptyException("employee", "Employee Detail is null");
        }
        return userRepository.save(user);
    }

    @Override
    public User resetPassword(int id){
        User user = findById(id);
        user.setPassword(passwordEncoder.encode("@1234567"));
        return userRepository.save(user);
    }

    @Override
    public User restoreUser(int id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("user", "User not found."));
        if (user != null) {
            user.setStatus(1);
        }
        return userRepository.save(user);
    }
}
