package com.example.quizexam_student.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    @NotBlank(message = "Level name is required.")
    @Column(name = "name", length = 10, nullable = false)
    private String name;

    @NotNull(message = "Point is required.")
    @Column(name = "point", nullable = false)
    private Integer point;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "level")
    @JsonIgnore
    private Set<Question> questions;

    @Column(name = "status")
    private int status;
}