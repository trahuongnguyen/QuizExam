package com.example.quizexam_student.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "t_question")
@Data
@NoArgsConstructor
@Getter
@Setter
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_id")
    private int id;

    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "status", nullable = false)
    private int status;

    @Column(name = "image", nullable = false)
    private String image;

    @ManyToMany(cascade = CascadeType.ALL, mappedBy = "questions")
    private Set<Examination> examinations;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Subject subject;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "rel_chapter_question", joinColumns = @JoinColumn( name = "question_id"), inverseJoinColumns = @JoinColumn(name = "chapter_id"))
    private Set<Chapter> chapters;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Level level;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "question")
    private Set<Answer> answers;
}
