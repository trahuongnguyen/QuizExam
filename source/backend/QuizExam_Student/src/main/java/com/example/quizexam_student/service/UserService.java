package com.example.quizexam_student.service;

import com.example.quizexam_student.bean.request.PasswordRequest;
import com.example.quizexam_student.bean.request.UserRequest;
import com.example.quizexam_student.bean.response.UserResponse;
import com.example.quizexam_student.entity.User;
import com.example.quizexam_student.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.support.PagedListHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {
    public User findUserByEmail(String email);
    public Boolean existUserByEmail(String email);
    public Boolean existUserByPhone(String phone);
    public User saveUser(UserRequest userRequest);
    public List<UserResponse> getAllUsers();
    public UserResponse getUserById(int id);
    public void changePassword(int id, PasswordRequest passwordRequest);
    public void deleteUserById(int id);
}
