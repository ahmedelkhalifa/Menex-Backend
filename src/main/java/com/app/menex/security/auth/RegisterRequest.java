package com.app.menex.security.auth;

import com.app.menex.enums.Role;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterRequest {

    @NotBlank(message = "email must be provided")
    @Email
    private String email;

    @NotBlank(message = "password must be provided")
    @Size(min = 8, message = "password can't be less than {min} characters")
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;
}
