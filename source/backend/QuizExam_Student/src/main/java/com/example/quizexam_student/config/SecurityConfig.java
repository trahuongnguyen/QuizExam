package com.example.quizexam_student.config;

import com.example.quizexam_student.exception.IncorrectEmailOrPassword;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .exceptionHandling()
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                .requestMatchers("/api/auth/export/excel").hasAnyRole("ADMIN", "DIRECTOR", "SRO")
                .requestMatchers("/api/auth/export/pdf").hasAnyRole("ADMIN", "DIRECTOR", "SRO")
                .requestMatchers("/api/auth/register").hasAnyRole("ADMIN", "DIRECTOR", "SRO")
                .requestMatchers("/api/auth/update/{id}").hasAnyRole("ADMIN", "DIRECTOR", "TEACHER", "SRO")
                .requestMatchers("/api/auth/profile/{id}").hasAnyRole("ADMIN", "DIRECTOR", "TEACHER", "SRO")
                .requestMatchers("/api/auth/role").permitAll()
                .requestMatchers("/api/auth/login").permitAll()
                .requestMatchers("/api/user").hasAnyRole("ADMIN", "DIRECTOR", "SRO")
                .requestMatchers("/api/student/profile/{id}").hasRole("STUDENT")
                .requestMatchers("/api/class/**").hasAnyRole("ADMIN", "DIRECTOR", "SRO")
                .requestMatchers("/api/subject/**").hasAnyRole("ADMIN", "DIRECTOR")
                .requestMatchers("/api/studentManagement/**").hasAnyRole("ADMIN", "SRO")
                .requestMatchers("/api/chapter/**").permitAll()
                .anyRequest().authenticated()
                
                .and()
                .httpBasic();
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
