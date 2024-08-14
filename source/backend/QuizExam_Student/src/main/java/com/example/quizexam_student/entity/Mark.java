package com.example.quizexam_student.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "t_mark")
@Data
@AllArgsConstructor
@RequiredArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Mark {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mark_id")
    private Integer id;

    @Column(name = "score", nullable = false)
    private Integer score;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "examination_id")
    private Examination examination;

    @OneToMany(mappedBy = "mark")
    private Set<StudentAnswer> studentAnswers;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "subject_id")
    private Subject subject;
}