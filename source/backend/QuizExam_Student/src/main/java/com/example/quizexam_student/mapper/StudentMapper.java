package com.example.quizexam_student.mapper;

import com.example.quizexam_student.bean.request.StudentRequest;
import com.example.quizexam_student.bean.response.StudentResponse;
import com.example.quizexam_student.bean.response.UserResponse;
import com.example.quizexam_student.entity.StudentDetail;

public class StudentMapper {
    public static StudentDetail convertFromRequest(StudentRequest studentRequest){
        StudentDetail studentDetail = new StudentDetail();
        studentDetail.setRollPortal(studentRequest.getRollPortal());
        studentDetail.setRollNumber(studentRequest.getRollNumber());
        return studentDetail;
    }

    public static StudentResponse convertToResponse(UserResponse userResponse, StudentDetail studentDetail){
        StudentResponse studentResponse = new StudentResponse();
        studentResponse.setUserResponse(userResponse);
        studentResponse.setRollPortal(studentDetail.getRollPortal());
        studentResponse.setRollNumber(studentDetail.getRollNumber());
        studentResponse.setStatus(studentDetail.getStatus());
        studentResponse.set_class(studentDetail.get_class());
        studentResponse.setMarks(studentDetail.getMarks().stream().toList());
        return studentResponse;
    }
}
