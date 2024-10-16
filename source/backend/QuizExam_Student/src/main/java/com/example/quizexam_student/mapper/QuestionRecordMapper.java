package com.example.quizexam_student.mapper;

import com.example.quizexam_student.bean.response.QuestionRecordResponse;
import com.example.quizexam_student.entity.QuestionRecord;


public class QuestionRecordMapper {
    public static QuestionRecordResponse convertToResponse(QuestionRecord questionRecord) {
        QuestionRecordResponse questionRecordResponse = new QuestionRecordResponse();
        questionRecordResponse.setId(questionRecord.getId());
        questionRecordResponse.setImage(questionRecord.getImage());
        questionRecordResponse.setContent(questionRecord.getContent());
        questionRecordResponse.setOptionA(questionRecord.getOptionA());
        questionRecordResponse.setOptionB(questionRecord.getOptionB());
        questionRecordResponse.setOptionC(questionRecord.getOptionC());
        questionRecordResponse.setOptionD(questionRecord.getOptionD());
        questionRecordResponse.setType(1);
        return questionRecordResponse;
    }
}
