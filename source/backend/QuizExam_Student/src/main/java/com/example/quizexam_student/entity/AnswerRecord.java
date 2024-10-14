package com.example.quizexam_student.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "t_answer_record")
@Data
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(exclude = {"questionRecord"})
public class AnswerRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "answer_record_id")
    private int id;

    @Column(name = "correct_option", nullable = false, columnDefinition = "text")
    private String correctOption;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "question_record_id")
    @JsonIgnore
    private QuestionRecord questionRecord;
}