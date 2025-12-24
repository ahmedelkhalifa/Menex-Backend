package com.app.menex.security.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;
    @Value("${jwt.expirationMs}")
    private Long expirationMs;

    public String generateToken(String email){
        return Jwts.builder()
                .claims()
                .issuer("Menex | menu application")
                .issuedAt(new Date())
                .expiration(new Date(new Date().getTime() + expirationMs))
                .subject(email)
                .and()
                .signWith(getSecretKey())
                .compact();
    }

    private SecretKey getSecretKey(){
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }

    public String getTokenFromHeader(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }

    public String getEmailFromToken(String token) {
        return Jwts.parser().verifyWith(getSecretKey())
                .build().parseSignedClaims(token).getPayload().getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(getSecretKey()).build().parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
