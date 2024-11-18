package com.example.quizexam_student;

import com.example.quizexam_student.entity.Classes;
import com.example.quizexam_student.entity.Examination;
import com.example.quizexam_student.repository.ClassesRepository;
import com.example.quizexam_student.repository.ExaminationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@SpringBootApplication
@RequiredArgsConstructor
@EnableScheduling
public class QuizExamStudentApplication {

    private final ClassesRepository classesRepository;
    private final ExaminationRepository examinationRepository;

    public static void main(String[] args) {
        SpringApplication.run(QuizExamStudentApplication.class, args);
    }
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:4200")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public void updateStatusForClasses() {
        List<Classes> classes = classesRepository.findByStatusOrderByIdDesc(0);
        classes = classes.stream().peek(classes1 -> {
            if (LocalDate.now().isBefore(classes1.getAdmissionDate())) {
                classes1.setStatus(1);
                classesRepository.save(classes1);
            }
        }).toList();
    }

    @Scheduled(fixedRate = 1000)
    public void updateStatusForExamination() {
        List<Examination> examinations = examinationRepository.findAllByStatus(1);
        examinations = examinations.stream().peek(examination -> {
            if (LocalDateTime.now().isAfter(examination.getEndTime())) {
                examination.setStatus(2);
                examination.getMarks().forEach(mark -> {
                    if (mark.getBeginTime()==null && mark.getScore()==null) {
                        mark.setScore(0);
                        mark.setBeginTime(LocalDateTime.now());
                        mark.setSubmittedTime(LocalDateTime.now());
                    }
                });
                examinationRepository.save(examination);
            }
        }).toList();
    }
}
