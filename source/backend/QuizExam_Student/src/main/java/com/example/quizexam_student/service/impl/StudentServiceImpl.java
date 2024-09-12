package com.example.quizexam_student.service.impl;

import com.example.quizexam_student.bean.request.UserRequest;
import com.example.quizexam_student.entity.*;
import com.example.quizexam_student.exception.AlreadyExistException;
import com.example.quizexam_student.exception.NotFoundException;
import com.example.quizexam_student.repository.RoleRepository;
import com.example.quizexam_student.repository.StatusRepository;
import com.example.quizexam_student.repository.StudentRepository;
import com.example.quizexam_student.repository.UserRepository;
import com.example.quizexam_student.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {
    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final StudentRepository studentRepository;

    private final StatusRepository statusRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
    public StudentDetail getStudentDetailByUser(User user) {
        return studentRepository.findStudentDetailByUser(user);
    }

    @Override
    public StudentDetail addStudent(UserRequest userRequest, StudentDetail studentDetail) {
        if (studentRepository.existsByRollPortal(studentDetail.getRollPortal())) {
            throw new AlreadyExistException("rollPortal", "Roll Portal already exists.");
        }
        if (studentRepository.existsByRollNumber(studentDetail.getRollNumber())) {
            throw new AlreadyExistException("rollNumber", "Roll Number already exists.");
        }
        User user = addUser(userRequest);
        Status status = statusRepository.findById(1).orElse(null);
        studentDetail.setStatus(status);
        studentDetail.setUser(user);
        return studentRepository.save(studentDetail);
    }

    @Override
    public StudentDetail updateStudent(UserRequest userInput, StudentDetail studentInput, int id) {
        User userUpdate = userRepository.findById(id).orElse(null);
        Role role = roleRepository.findById(5).orElse(null);
        StudentDetail studentUpdate = studentRepository.findById(id).orElse(null);

        if (Objects.isNull(userUpdate) || userUpdate.getStatus() == 0 || Objects.isNull(studentUpdate)) {
            throw new NotFoundException("student", "Student not found.");
        }
        if (userRepository.existsByEmailAndIdNot(userInput.getEmail(), id)) {
            throw new AlreadyExistException("email", "Email already exists.");
        }
        if (userRepository.existsByPhoneNumberAndIdNot(userInput.getPhoneNumber(), id)) {
            throw new AlreadyExistException("phoneNumber", "Phone Number already exists.");
        }
        if (studentRepository.existsByRollPortalAndUserNot(studentInput.getRollPortal(), userUpdate)) {
            throw new AlreadyExistException("rollPortal", "Roll Portal already exists.");
        }
        if (studentRepository.existsByRollNumberAndUserNot(studentInput.getRollNumber(), userUpdate)) {
            throw new AlreadyExistException("rollNumber", "Roll Number already exists.");
        }

        // Cập nhật bảng user
        setUser(userUpdate, userInput);
        userRepository.save(userUpdate);

        // Cập nhật bảng student_detail
        studentUpdate.setRollPortal(studentInput.getRollPortal());
        studentUpdate.setRollNumber(studentInput.getRollNumber());
        studentRepository.save(studentUpdate);
        return null;
    }

    public User addUser(UserRequest userRequest) {
        if (userRepository.existsByEmail(userRequest.getEmail())) {
            throw new AlreadyExistException("email", "Email already exists.");
        }
        if (userRepository.existsByPhoneNumber(userRequest.getPhoneNumber())) {
            throw new AlreadyExistException("phoneNumber", "Phone Number already exists.");
        }
        User user = new User();
        user.setEmail(userRequest.getEmail());
        user.setPassword(passwordEncoder.encode("@1234567"));
        user.setDob(userRequest.getDob());
        user.setGender(userRequest.getGender());
        user.setFullName(userRequest.getFullName());
        user.setAddress(userRequest.getAddress());
        user.setPhoneNumber(userRequest.getPhoneNumber());
        Role role = roleRepository.findById(5).orElse(null);
        user.setRole(role);
        user.setStatus(1);
        return userRepository.save(user);
    }

    public void setUser(User userUpdate, UserRequest userInput) {
        userUpdate.setEmail(userInput.getEmail());
        userUpdate.setDob(userInput.getDob());
        userUpdate.setGender(userInput.getGender());
        userUpdate.setFullName(userInput.getFullName());
        userUpdate.setAddress(userInput.getAddress());
        userUpdate.setPhoneNumber(userInput.getPhoneNumber());
    }
}
