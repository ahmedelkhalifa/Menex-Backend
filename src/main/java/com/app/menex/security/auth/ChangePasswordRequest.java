package com.app.menex.security.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChangePasswordRequest {
    @Size(min = 8)
    @NotBlank
    @NotNull
    private String oldPassword;
    @Size(min = 8)
    @NotBlank
    @NotNull
    private String newPassword;
}
