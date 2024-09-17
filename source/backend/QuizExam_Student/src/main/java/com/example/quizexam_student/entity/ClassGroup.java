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
    @Column(name = "class_id")
    private int id;
    @MapsId
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "class_id")
    private Classes _class;
    @Column(name = "count", nullable = false)
    private int count;
}
