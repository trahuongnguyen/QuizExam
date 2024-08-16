package com.example.quizexam_student.service;

import com.example.quizexam_student.entity.User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public interface UserService {
    Optional<User> findByEmail(String email);

}
