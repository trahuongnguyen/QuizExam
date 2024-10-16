package com.example.quizexam_student.mapper;

import com.example.quizexam_student.bean.request.ExaminationRequest;
import com.example.quizexam_student.bean.response.ExaminationResponse;
import com.example.quizexam_student.bean.response.ExaminationResponseNotIncludeQuestion;
import com.example.quizexam_student.entity.Examination;

public class ExaminationMapper {
    public static Examination convertFromRequest(ExaminationRequest examinationRequest){
        Examination examination = new Examination();
        examination.setName(examinationRequest.getName());
        examination.setStartTime(examinationRequest.getStartTime());
        examination.setEndTime(examinationRequest.getEndTime());
        examination.setDuration(examinationRequest.getDuration());
        return examination;
    }

    public static ExaminationResponse convertToResponse(Examination examination){
        ExaminationResponse examinationResponse = new ExaminationResponse();
        assert examination != null;
        examinationResponse.setId(examination.getId());
        examinationResponse.setName(examination.getName());
        examinationResponse.setStartTime(examination.getStartTime());
        examinationResponse.setEndTime(examination.getEndTime());
        examinationResponse.setDuration(examination.getDuration());
        examinationResponse.setCode(examination.getCode());
        examinationResponse.setSubject(examination.getSubject());
        return examinationResponse;
    }

    public static ExaminationResponseNotIncludeQuestion convertToResponseNotIncludeQuestion(ExaminationResponse examinationResponse){
        ExaminationResponseNotIncludeQuestion examinationResponseNotIncludeQuestion = new ExaminationResponseNotIncludeQuestion();
        examinationResponseNotIncludeQuestion.setId(examinationResponse.getId());
        examinationResponseNotIncludeQuestion.setName(examinationResponse.getName());
        examinationResponseNotIncludeQuestion.setStartTime(examinationResponse.getStartTime());
        examinationResponseNotIncludeQuestion.setEndTime(examinationResponse.getEndTime());
        examinationResponseNotIncludeQuestion.setDuration(examinationResponse.getDuration());
        examinationResponseNotIncludeQuestion.setCode(examinationResponse.getCode());
        examinationResponseNotIncludeQuestion.setSubject(examinationResponse.getSubject());
        return examinationResponseNotIncludeQuestion;
    }
}
