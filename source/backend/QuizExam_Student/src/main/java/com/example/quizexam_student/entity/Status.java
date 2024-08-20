package com.example.quizexam_student.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Data
@Entity
@Table(name = "t_status")
@NoArgsConstructor
@Getter
@Setter
public class Status {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "status_id")
    private int id;
    @Column(name = "name", nullable = false)
    private String name;
    @OneToMany(mappedBy = "status")
    private Set<StudentDetail> studentDetails;
}
