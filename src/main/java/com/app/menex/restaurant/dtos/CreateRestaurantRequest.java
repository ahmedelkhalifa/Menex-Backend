package com.app.menex.restaurant.dtos;

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
public class CreateRestaurantRequest {
    @NotBlank(message = "name can't be empty")
    @Size(min = 2, max = 100, message = "name must be between {min} and {max} characters")
    private String name;
    private String address;
    private String phone;
    private String primaryColor;
    private String secondaryColor;
    private String textPrimary;
    private String textSecondary;
    private String background;
    private String backgroundCard;
    private String font;
}
