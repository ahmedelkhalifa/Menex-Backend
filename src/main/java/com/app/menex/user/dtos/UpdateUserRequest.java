package com.app.menex.user.dtos;

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
public class UpdateUserRequest {
    @Size(min = 2, max = 50, message = "name must be between {min} and {max} characters")
    @NotBlank
    private String firstname;
    @Size(min = 2, max = 50, message = "name must be between {min} and {max} characters")
    @NotBlank
    private String lastname;
    @NotBlank
    @Email
    private String email;
    @Enumerated(EnumType.STRING)
    private Role role;
}
