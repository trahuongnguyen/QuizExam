package com.example.quizexam_student.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "t_sem")
@Data
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@Builder
public class Sem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sem_id")
    private int id;

    @Column(name = "name", nullable = false)
    private String name;

    @OneToMany(mappedBy = "sem")
    private Set<Subject> subjects;
}
