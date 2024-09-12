package com.example.quizexam_student.mapper;

import com.example.quizexam_student.bean.request.UserRequest;
import com.example.quizexam_student.bean.response.StudentResponse;
import com.example.quizexam_student.bean.response.UserResponse;
import com.example.quizexam_student.entity.StudentDetail;
import com.example.quizexam_student.entity.User;
import com.example.quizexam_student.repository.StudentRepository;
import com.example.quizexam_student.repository.UserRepository;
import com.example.quizexam_student.service.StudentService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

public class UserMapper {

    public static UserResponse convertToResponse(User user){
        user.setStudentDetail(null);
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

    public static User convertFromRequest(UserRequest userRequest){
        User user = new User();
        user.setEmail(userRequest.getEmail());
        user.setDob(userRequest.getDob());
        user.setGender(userRequest.getGender());
        user.setFullName(userRequest.getFullName());
        user.setAddress(userRequest.getAddress());
        user.setPhoneNumber(userRequest.getPhoneNumber());
        return user;
    }
}
