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

    @Column(name = "content", nullable = false, columnDefinition = "text")
    @Lob
    private String content;

    @Column(name = "option_a", nullable = false, columnDefinition = "text")
    @Lob
    private String optionA;

    @Column(name = "option_b", nullable = false, columnDefinition = "text")
    @Lob
    private String optionB;

    @Column(name = "option_c", nullable = false, columnDefinition = "text")
    @Lob
    private String optionC;

    @Column(name = "option_d", nullable = false, columnDefinition = "text")
    @Lob
    private String optionD;

    @Column(name = "type", nullable = false)
    private Integer type;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "examination_id")
    private Examination examination;

    @OneToMany(mappedBy = "questionRecord")
    private Set<AnswerRecord> answerRecords;

    @OneToMany(mappedBy = "questionRecord")
    private Set<StudentAnswer> studentAnswers;
}