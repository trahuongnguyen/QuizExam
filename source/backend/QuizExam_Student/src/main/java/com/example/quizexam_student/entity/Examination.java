package com.example.quizexam_student.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "t_examination")
@Data
@NoArgsConstructor
@Getter
@Setter
public class Examination {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "examination_id")
    private Integer id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "start_time", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime endTime;

    @Column(name = "duration", nullable = false)
    private Integer duration;

    @Column(name = "code", nullable = false)
    private String code;

    @Column(name = "status", nullable = false)
    private Integer status;

    @Column(name = "type", nullable = false)
    private Integer type;

    @OneToMany(mappedBy = "examination")
    private Set<Mark> marks;

    @OneToMany(mappedBy = "examination")
    private Set<QuestionRecord> questionRecords;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "rel_examination_question",
            joinColumns = @JoinColumn(name = "examination_id"),
            inverseJoinColumns = @JoinColumn(name = "question_id"))
    private Set<Question> questions;
}