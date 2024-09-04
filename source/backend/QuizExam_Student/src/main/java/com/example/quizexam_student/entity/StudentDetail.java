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
public class StudentDetail {
    @Id
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    @Column(name = "roll_portal", nullable = false)
    private String rollPortal;
    @Column(name = "roll_number", nullable = false)
    private String rollNumber;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "status_id")
    private Status status;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "class_id")
    private Class _class;
    @OneToMany(mappedBy = "studentDetail")
    private Set<Mark> marks;
}
