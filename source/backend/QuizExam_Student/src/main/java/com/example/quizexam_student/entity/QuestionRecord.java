package com.example.quizexam_student.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "t_question_record")
@Data
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(exclude = {"examination"})
public class QuestionRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_record_id")
    private int id;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "image")
    private String image;

    @Column(name = "point", nullable = false)
    private Integer point;

    @Column(name = "type", nullable = false)
    private Integer type;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "examination_id")
    private Examination examination;

    @OneToMany(mappedBy = "questionRecord")
    private Set<AnswerRecord> answerRecords = new HashSet<>();

    @OneToMany(mappedBy = "questionRecord")
    private Set<StudentAnswer> studentAnswers;
}