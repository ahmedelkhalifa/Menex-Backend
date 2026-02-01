package com.app.menex.menu.dtos;

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
public class UpdateMenuRequest {
    @Size(min = 4, max = 100, message = "name must be between {min} and {max} characters")
    @NotBlank(message = "name can't be empty")
    private String menuName;
}
