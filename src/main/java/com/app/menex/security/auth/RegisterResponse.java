package com.app.menex.security.auth;

import com.app.menex.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterResponse {
    private Long id;
    private String firstname;
    private String lastname;
    private String email;
    private String token;
    private Role role;
    private LocalDateTime createdAt;
}
