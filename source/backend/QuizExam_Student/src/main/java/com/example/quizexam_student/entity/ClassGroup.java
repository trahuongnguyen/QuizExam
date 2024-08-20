package com.example.quizexam_student.entity;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Table(name = "t_class_group")
@NoArgsConstructor
@Getter
@Setter
public class ClassGroup {
    @Id
    @OneToOne(cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private Class _class;
    @Column(name = "count", nullable = false)
    private int count;
}
