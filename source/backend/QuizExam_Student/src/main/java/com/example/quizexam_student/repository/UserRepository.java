package com.example.quizexam_student.repository;

import com.example.quizexam_student.bean.response.UserResponse;
import com.example.quizexam_student.entity.Role;
import com.example.quizexam_student.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    Optional<User> findByPhoneNumber(String phoneNumber);
    List<User> findByRole(Role role);

    boolean existsByEmail(String email); // Kiểm tra email có tồn tại hay không

    boolean existsByPhoneNumber(String phoneNumber); // Kiểm tra phone number có tồn tại hay không

    boolean existsByEmailAndIdNot(String email, Integer id); // Kiểm tra email đã tồn tại hay chưa, ngoại trừ chính nó (update)

    boolean existsByPhoneNumberAndIdNot(String phoneNumber, Integer id); // Kiểm tra phone number đã tồn tại hay chưa, ngoại trừ chính nó (update)

//    @Query("SElECT u FROM User u JOIN Role r ON u.role = r WHERE r.name != :roleName")
//    List<User> findAllWithoutRole(@Param("roleName") String roleName);
}
