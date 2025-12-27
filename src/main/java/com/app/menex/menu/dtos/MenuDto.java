package com.app.menex.menu.dtos;

import com.app.menex.restaurant.dtos.RestaurantDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MenuDto {
    private Long id;
    private String name;
    private boolean active;
    private RestaurantDto restaurant;
    private Integer categoriesCount;
}
