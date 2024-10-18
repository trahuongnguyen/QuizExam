package com.example.quizexam_student.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Data
@Entity
@Table(name = "t_student_detail")
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(exclude = {"user", "_class"})
public class StudentDetail {
    @Id
    @Column(name = "user_id")
    private int userId;

    @MapsId
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "roll_portal", length = 20, nullable = false)
    private String rollPortal;

    @Column(name = "roll_number", length = 20, nullable = false)
    private String rollNumber;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "status_id")
    private Status status;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "class_id")
    private Classes _class;

    @OneToMany(mappedBy = "studentDetail")
    private Set<Mark> marks;
}