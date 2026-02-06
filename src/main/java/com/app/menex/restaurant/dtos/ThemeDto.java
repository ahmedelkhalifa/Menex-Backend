package com.app.menex.restaurant.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ThemeDto {
    private String primaryColor;
    private String secondaryColor;
    private String textPrimary;
    private String textSecondary;
    private String background;
    private String backgroundCard;
    private String font;
}
