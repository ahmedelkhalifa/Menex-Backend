package com.app.menex.publicAPI.dtos;

import com.app.menex.restaurant.dtos.ThemeDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PublicMenuDto {
    private Long id;
    private String name;
    private boolean active;
    private String description;
    private String imageUrl;
    private List<PublicCategoryDto> categories;
    private List<PublicMenuItemDto> menuItems;
    private ThemeDto theme;
}
