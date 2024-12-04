package com.example.quizexam_student.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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

    @Column(name = "name", length = 20, nullable = false)
    @NotBlank(message = "Level name is required.")
    @Size(max = 20, message = "Level name must be less than or equal to 20 characters")
    private String name;

    @Column(name = "point", nullable = false)
    @NotNull(message = "Point is required.")
    @DecimalMin(value = "0.25", message = "Point must be greater than or equal to 0.25")
    @DecimalMax(value = "10.0", message = "Point must be less than or equal to 10")
    private Double point;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "level")
    @JsonIgnore
    private Set<Question> questions;

    @Column(name = "status")
    private int status;
}