package com.example.quizexam_student.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "t_level")
@Data
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Level {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "level_id")
    private int id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "point", nullable = false)
    private int point;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "level")
    private Set<Question> questions;
}
