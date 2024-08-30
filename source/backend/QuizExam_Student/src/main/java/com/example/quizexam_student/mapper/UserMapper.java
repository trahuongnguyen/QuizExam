package com.example.quizexam_student.mapper;

import com.example.quizexam_student.bean.response.UserResponse;
import com.example.quizexam_student.entity.User;

public class UserMapper {
    public static UserResponse convertToResponse(User user){
        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setFullName(user.getFullName());
        userResponse.setEmail(user.getEmail());
        userResponse.setDob(user.getDob());
        userResponse.setGender(user.getGender());
        userResponse.setPhoneNumber(user.getPhoneNumber());
        userResponse.setAddress(user.getAddress());
        userResponse.setRole(user.getRole());
        return userResponse;
    }
}
