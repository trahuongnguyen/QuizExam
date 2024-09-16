package com.example.quizexam_student.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "t_answer")
@Data
@NoArgsConstructor
@Getter
@Setter
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "answer_id")
    private int id;

    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "is_correct", columnDefinition = "TINYINT", nullable = false)
    private boolean isCorrect;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "question_id")
    private Question question;
}
