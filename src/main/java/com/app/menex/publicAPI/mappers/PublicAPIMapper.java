package com.app.menex.publicAPI.mappers;

import com.app.menex.category.Category;
import com.app.menex.category.mappers.CategoryMapper;
import com.app.menex.menu.Menu;
import com.app.menex.menuItem.MenuItem;
import com.app.menex.menuItem.dtos.MenuItemDto;
import com.app.menex.publicAPI.dtos.PublicCategoryDto;
import com.app.menex.publicAPI.dtos.PublicMenuDto;
import com.app.menex.publicAPI.dtos.PublicMenuItemDto;
import com.app.menex.publicAPI.dtos.PublicRestaurantDto;
import com.app.menex.restaurant.Restaurant;
import com.app.menex.restaurant.dtos.ThemeDto;
import com.app.menex.theme.Theme;
import org.mapstruct.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses ={
        com.app.menex.menu.mappers.MenuMapper.class,
        com.app.menex.restaurant.mappers.ThemeMapper.class,
        com.app.menex.category.mappers.CategoryMapper.class,
})
public interface PublicAPIMapper {

    @Mapping(source = "logoUrl", target = "logoUrl")
    PublicRestaurantDto toPublicRestaurant(Restaurant restaurant);

    @Mapping(source = "categories", target = "categories")
    @Mapping(source = "categories", target = "menuItems", qualifiedByName = "getMenuItems")
    @Mapping(source = "restaurant", target = "theme", qualifiedByName = "getTheme")
    PublicMenuDto toPublicMenu(Menu menu);

//    default ThemeDto toThemeDto(Theme theme) {
//        ThemeDto themeDto = ThemeDto.builder()
//                .primaryColor(theme.getPrimaryColor())
//                .secondaryColor(theme.getSecondaryColor())
//                .textPrimary(theme.getTextPrimary())
//                .textSecondary(theme.getTextSecondary())
//                .background(theme.getBackground())
//                .backgroundCard(theme.getBackgroundCard())
//                .font(theme.getFont())
//                .build();
//        return themeDto;
//    }

    @Named("getTheme")
    default Theme getTheme(Restaurant restaurant){
        Theme theme = restaurant.getTheme();
        return theme;
    }

    PublicMenuItemDto toPublicMenuItemDto(MenuItem item);

    @Named("getMenuItems")
    default List<PublicMenuItemDto> getMenuItems(List<Category> categories) {
        List<PublicMenuItemDto> result = new ArrayList<>();

        if (categories == null) {
            return result;
        }

        for (Category category : categories) {
            if (category.getMenuItems() != null) {
                for (MenuItem item : category.getMenuItems()) {
                    result.add(toPublicMenuItemDto(item));
                }
            }
        }

        return result;
    }

    default List<PublicCategoryDto> getCategories(
            List<Category> categories,
            @Context CategoryMapper categoryMapper
    ) {
        if (categories == null) {
            return Collections.emptyList();
        }

        return categories.stream()
                .map(categoryMapper::toPublicCategory)
                .toList();
    }
}
