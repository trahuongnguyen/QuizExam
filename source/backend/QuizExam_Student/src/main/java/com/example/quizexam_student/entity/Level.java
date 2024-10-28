package com.example.quizexam_student.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "t_level")
@Data
@NoArgsConstructor
@Getter
@Setter
public class Level {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "level_id")
    private int id;

    @Column(name = "name", length = 10, nullable = false)
    private String name;

    @Column(name = "point", nullable = false)
    private int point;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "level")
    @JsonIgnore
    private Set<Question> questions;

    @Column(name = "status")
    private int status;
}