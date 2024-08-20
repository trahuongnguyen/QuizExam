package com.example.quizexam_student.service;

import com.example.quizexam_student.bean.request.UserRequest;
import com.example.quizexam_student.entity.User;
import com.example.quizexam_student.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
public interface UserService {
    public User findUserByEmail(String email);
    public Boolean existUserByEmail(String email);
    public User saveUser(UserRequest userRequest);
}
