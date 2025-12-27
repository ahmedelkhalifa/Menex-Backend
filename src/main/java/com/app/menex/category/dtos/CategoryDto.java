package com.app.menex.category.dtos;

import com.app.menex.menu.dtos.MenuDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoryDto {
    private Long id;
    private String categoryName;
    private MenuDto menu;
    private Integer menuItemsCount;
}
