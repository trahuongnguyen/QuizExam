package com.example.quizexam_student.util;

import com.example.quizexam_student.exception.AuthenticatedException;
import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secret;
    @Value("${jwt.expiration}")
    private Long expiration;

    public String generateJwtToken(Authentication authentication) {
        String email = authentication.getName();
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }

    public String getEmailFromJwtToken(String token) {
        Claims claims  = Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public Boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secret).parseClaimsJws(token);
            return true;
        } catch (SignatureException e) {
            throw new AuthenticatedException("token", "Invalid JWT signature");
        } catch (MalformedJwtException e) {
            throw new AuthenticatedException("token", "Invalid JWT token");
        } catch (ExpiredJwtException e) {
            throw new AuthenticatedException("token", "Expired JWT token");
        } catch (UnsupportedJwtException e) {
            throw new AuthenticatedException("token", "Unsupported JWT token");
        } catch (IllegalArgumentException e) {
            throw new AuthenticatedException("token", "JWT claims string is empty");
        }
    }
}
