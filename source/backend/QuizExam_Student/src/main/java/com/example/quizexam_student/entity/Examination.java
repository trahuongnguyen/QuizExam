package com.example.quizexam_student.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "t_examination")
@Data
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class Examination {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "examination_id")
    private int id;

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

    @OneToMany(mappedBy = "examination")
    private Set<Mark> marks;

    @OneToMany(mappedBy = "examination")
    private Set<QuestionRecord> questionRecords = new HashSet<>();

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "rel_examination_question",
            joinColumns = @JoinColumn(name = "examination_id"),
            inverseJoinColumns = @JoinColumn(name = "question_id"))
    private Set<Question> questions;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "subject_id")
    private Subject subject;
}