package com.example.quizexam_student.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "t_question_record")
@Data
@NoArgsConstructor
@Getter
@Setter
public class QuestionRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_record_id")
    private int id;

    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "option_a", nullable = false)
    private String optionA;

    @Column(name = "option_b", nullable = false)
    private String optionB;

    @Column(name = "option_c", nullable = false)
    private String optionC;

    @Column(name = "option_d", nullable = false)
    private String optionD;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "examination_id")
    private Examination examination;

    @OneToMany(mappedBy = "questionRecord")
    private Set<AnswerRecord> answerRecords;

    @OneToMany(mappedBy = "questionRecord")
    private Set<StudentAnswer> studentAnswers;
}