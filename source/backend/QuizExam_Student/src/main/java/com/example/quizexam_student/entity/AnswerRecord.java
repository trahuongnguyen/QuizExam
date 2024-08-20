package com.example.quizexam_student.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "t_answer_record")
@Data
@NoArgsConstructor
@Getter
@Setter
public class AnswerRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "answer_record_id")
    private Integer id;

    @Column(name = "correct_option", nullable = false)
    private String correctOption;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "question_record_id")
    private QuestionRecord questionRecord;
}