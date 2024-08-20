package com.example.quizexam_student.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Data
@Table(name = "t_class")
@NoArgsConstructor
@Getter
@Setter
public class Class {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "class_id")
    private int id;
    @Column(name = "name", nullable = false)
    private String name;
    @Column(name = "status", nullable = false)
    private int status;
    @OneToMany(mappedBy = "_class")
    private Set<StudentDetail> studentDetails;
    @OneToOne(mappedBy = "_class")
    private ClassGroup classGroup;
}
