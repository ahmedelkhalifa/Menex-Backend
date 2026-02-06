package com.app.menex.category.mappers;

import com.app.menex.category.Category;
import com.app.menex.category.dtos.CategoryDto;
import com.app.menex.menuItem.MenuItem;
import com.app.menex.publicAPI.dtos.PublicCategoryDto;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
uses = {com.app.menex.menu.mappers.MenuMapper.class})
public interface CategoryMapper {

    @Mapping(source = "menu", target = "menu")
    @Mapping(source = "menuItems", target = "menuItemsCount", qualifiedByName = "getItemsCount")
    @Mapping(source = "name", target = "categoryName")
    CategoryDto toDto(Category category);


    @Named("getItemsCount")
    default Integer getItemsCount(List<MenuItem> items) {
        return items == null ? 0 : items.size();
    }

    PublicCategoryDto toPublicCategory(Category category);

    @AfterMapping
    default void setMenuItemsCount(
            Category category,
            @MappingTarget PublicCategoryDto.PublicCategoryDtoBuilder dto
    ) {
        dto.menuItemsCount(
                category.getMenuItems() == null ? 0 : category.getMenuItems().size()
        );
    }
}
