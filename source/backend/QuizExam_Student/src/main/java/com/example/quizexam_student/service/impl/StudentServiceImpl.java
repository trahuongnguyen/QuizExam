package com.example.quizexam_student.service.impl;

import com.example.quizexam_student.bean.request.*;
import com.example.quizexam_student.bean.response.*;
import com.example.quizexam_student.entity.*;
import com.example.quizexam_student.exception.*;
import com.example.quizexam_student.mapper.*;
import com.example.quizexam_student.repository.*;
import com.example.quizexam_student.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {
    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final StudentRepository studentRepository;

    private final ClassesRepository classesRepository;

    private final PasswordEncoder passwordEncoder;

    private final UserService userService;

    @Override
    public List<StudentResponse> getAllStudents() {
        Role role = roleRepository.findByName("STUDENT");
        List<UserResponse> userResponses = userRepository.findByRoleAndStatus(role,1).stream().map(UserMapper::convertToResponse).toList();
        return userResponses.stream().map(userResponse -> StudentMapper.convertToResponse(userResponse, studentRepository.findByUser(userRepository.findById(userResponse.getId()).orElse(null)))).collect(Collectors.toList());
    }

    @Override
    public List<StudentResponse> getAllStudentsAndStatusInactive() {
        Role role = roleRepository.findByName("STUDENT");
        List<UserResponse> userResponses = userRepository.findByRoleAndStatus(role,0).stream().map(UserMapper::convertToResponse).toList();
        return userResponses.stream().map(userResponse -> StudentMapper.convertToResponse(userResponse, studentRepository.findByUser(userRepository.findById(userResponse.getId()).orElse(null)))).collect(Collectors.toList());
    }

    @Override
    public StudentDetail getStudentDetailByUser(User user) {
        return studentRepository.findStudentDetailByUser(user);
    }

    @Override
    public List<StudentResponse> getAllStudentsNoneClass() {
        Role role = roleRepository.findByName("STUDENT");
        List<UserResponse> userResponses = userRepository.findByRoleAndStatus(role,1).stream().map(UserMapper::convertToResponse).toList();
        List<StudentResponse> studentResponses = userResponses.stream().map(userResponse -> StudentMapper.convertToResponse(userResponse, studentRepository.findByUser(userRepository.findById(userResponse.getId()).orElse(null)))).collect(Collectors.toList());
        studentResponses.removeIf(std->std.get_class()!=null);
        return studentResponses;
    }

    @Override
    public List<StudentResponse> getAllStudentsNoneClassAndStatusInactive() {
        Role role = roleRepository.findByName("STUDENT");
        List<UserResponse> userResponses = userRepository.findByRoleAndStatus(role,0).stream().map(UserMapper::convertToResponse).toList();
        List<StudentResponse> studentResponses = userResponses.stream().map(userResponse -> StudentMapper.convertToResponse(userResponse, studentRepository.findByUser(userRepository.findById(userResponse.getId()).orElse(null)))).collect(Collectors.toList());
        studentResponses.removeIf(std->std.get_class()!=null);
        return studentResponses;
    }

    @Override
    public List<StudentResponse> getAllStudentsByClass(int classId) {
        Role role = roleRepository.findByName("STUDENT");
        List<UserResponse> userResponses = userRepository.findByRoleAndStatus(role,1).stream().map(UserMapper::convertToResponse).toList();
        List<StudentResponse> studentResponses = userResponses.stream().map(userResponse -> StudentMapper.convertToResponse(userResponse, studentRepository.findByUser(userRepository.findById(userResponse.getId()).orElse(null)))).collect(Collectors.toList());
        studentResponses.removeIf(std->std.get_class()==null||std.get_class().getId()!=classId);
        return studentResponses;
    }

    @Override
    public List<StudentResponse> getAllStudentsByClassAndStatusInactive(int classId) {
        Role role = roleRepository.findByName("STUDENT");
        List<UserResponse> userResponses = userRepository.findByRoleAndStatus(role,0).stream().map(UserMapper::convertToResponse).toList();
        List<StudentResponse> studentResponses = userResponses.stream().map(userResponse -> StudentMapper.convertToResponse(userResponse, studentRepository.findByUser(userRepository.findById(userResponse.getId()).orElse(null)))).collect(Collectors.toList());
        studentResponses.removeIf(std->std.get_class()==null||std.get_class().getId()!=classId);
        return studentResponses;
    }

    @Override
    public StudentDetail addStudent(StudentRequest studentRequest) {
        if (studentRepository.existsByRollPortal(studentRequest.getRollPortal())) {
            StudentDetail studentDetail = studentRepository.findByRollPortal(studentRequest.getRollPortal());
            if (studentDetail.getUser().getStatus() == 0){
                throw new AlreadyExistException("studentRestore","Student already hide. Do you want restore student?");
            }
            throw new AlreadyExistException("rollPortal", "Roll Portal already exists.");
        }
        if (studentRepository.existsByRollNumber(studentRequest.getRollNumber())) {
            StudentDetail studentDetail = studentRepository.findByRollNumber(studentRequest.getRollNumber());
            if (studentDetail.getUser().getStatus() == 0){
                throw new AlreadyExistException("studentRestore","Student already hide. Do you want restore student?");
            }
            throw new AlreadyExistException("rollNumber", "Roll Number already exists.");
        }
        User user = userService.saveUser(studentRequest.getUserRequest());
        StudentDetail studentDetail = StudentMapper.convertFromRequest(studentRequest);
        Classes classes = classesRepository.findById(studentRequest.getClassId()).orElse(null);
        studentDetail.setUser(user);
        studentDetail.set_class(classes);
        return studentRepository.save(studentDetail);
    }

    @Override
    public StudentDetail updateStudent(StudentRequest studentRequest, int id) {
        User userUpdate = userRepository.findById(id).orElse(null);
        Role role = roleRepository.findById(5).orElse(null);
        StudentDetail studentUpdate = studentRepository.findById(id).orElse(null);

        if (Objects.isNull(userUpdate) || userUpdate.getStatus() == 0 || Objects.isNull(studentUpdate)) {
            throw new NotFoundException("student", "Student not found.");
        }
        UserRequest userRequest = studentRequest.getUserRequest();
        if (userRepository.existsByEmailAndIdNot(userRequest.getEmail(), id)) {
            throw new AlreadyExistException("email", "Email already exists.");
        }
        if (userRepository.existsByPhoneNumberAndIdNot(userRequest.getPhoneNumber(), id)) {
            throw new AlreadyExistException("phoneNumber", "Phone Number already exists.");
        }
        if (studentRepository.existsByRollPortalAndUserNot(studentRequest.getRollPortal(), userUpdate)) {
            throw new AlreadyExistException("rollPortal", "Roll Portal already exists.");
        }
        if (studentRepository.existsByRollNumberAndUserNot(studentRequest.getRollNumber(), userUpdate)) {
            throw new AlreadyExistException("rollNumber", "Roll Number already exists.");
        }

        // Cập nhật bảng user
        userUpdate = UserMapper.convertFromRequest(userRequest);
        userUpdate.setRole(role);
        userUpdate.setId(id);
        userUpdate.setPassword(passwordEncoder.encode("@1234567"));
        userUpdate.setStatus(1);
        userRepository.save(userUpdate);

        // Cập nhật bảng student_detail
        studentUpdate.setRollPortal(studentRequest.getRollPortal());
        studentUpdate.setRollNumber(studentRequest.getRollNumber());
        return studentRepository.save(studentUpdate);
    }

    @Override
    public void updateClassForStudents(List<Integer> userIds, int classId) {
        Classes newClass = classesRepository.findById(classId).orElse(null);
        if (Objects.isNull(newClass) && newClass.getStatus() == 0) {
            throw new NotFoundException("class", "Class not found.");
        }
        List<StudentDetail> students = studentRepository.findAllByUserIdIn(userIds);
        for (StudentDetail student : students) {
            student.set_class(newClass);
        }
        studentRepository.saveAll(students);
    }

    @Override
    public void deleteStudent(int id) {
        Role role = roleRepository.findByName("STUDENT");
        User user = userRepository.findByIdAndStatusAndRole(id,1,role);
        if (Objects.isNull(user)){
            throw new NotFoundException("student", "Student not found.");
        }
        user.setStatus(0);
        userRepository.save(user);
    }

    @Override
    public void restoreStudent(int id) {
        Role role = roleRepository.findByName("STUDENT");
        User user = userRepository.findByIdAndStatusAndRole(id,0,role);
        if (Objects.isNull(user)){
            throw new NotFoundException("student", "Student not found.");
        }
        user.setStatus(1);
        userRepository.save(user);
    }

}
