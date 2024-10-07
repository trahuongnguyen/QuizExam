package com.example.quizexam_student.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.Set;

@Entity
@Data
@Table(name = "t_class")
@NoArgsConstructor
@Getter
@Setter
@Builder
@AllArgsConstructor
@EqualsAndHashCode
public class Classes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "class_id")
    private int id;

    @Column(name = "name", nullable = false)
    @NotBlank(message = "Class Name is required")
    private String name;

    @Column(name = "class_day", nullable = false)
    @NotBlank(message = "Class Day is required")
    private String classDay;

    @Column(name = "class_time", nullable = false)
    @NotBlank(message = "Class Time is required")
    private String classTime;

    @Column(name = "admission_date", nullable = false)
    @NotNull(message = "Admission Date is required")
    private LocalDate admissionDate;

    @Column(name = "status", nullable = false)
    private int status;

    @OneToMany(mappedBy = "_class")
    @JsonIgnore
    private Set<StudentDetail> studentDetails;

    @OneToOne(mappedBy = "_class")
    private ClassGroup classGroup;
}