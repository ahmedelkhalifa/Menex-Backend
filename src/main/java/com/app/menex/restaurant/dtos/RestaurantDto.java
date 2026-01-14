package com.app.menex.restaurant.dtos;

import com.app.menex.menu.Menu;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RestaurantDto {
    private Long id;
    private String name;
    private String slug;
    private String address;
    private String phone;
    private String ownerEmail;
    private Integer menusCount;
    private ThemeDto theme;
}
