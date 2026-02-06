package com.app.menex.publicAPI.dtos;

import com.app.menex.menu.dtos.MenuDto;
import com.app.menex.restaurant.dtos.ThemeDto;
import com.app.menex.theme.Theme;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PublicRestaurantDto {
    private String name;
    private String address;
    private String phone;
    private List<MenuDto> menus;
    private ThemeDto theme;
    private String logoUrl;
}
