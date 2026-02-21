package com.app.menex.restaurant.mappers;

import com.app.menex.category.Category;
import com.app.menex.menu.Menu;
import com.app.menex.menu.dtos.MenuDto;
import com.app.menex.publicAPI.dtos.PublicRestaurantDto;
import com.app.menex.restaurant.Restaurant;
import com.app.menex.restaurant.dtos.RestaurantDto;
import com.app.menex.restaurant.dtos.ThemeDto;
import com.app.menex.theme.Theme;
import com.app.menex.user.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
uses = {ThemeMapper.class})
public interface RestaurantMapper {

    @Mapping(source = "owner", target = "ownerEmail", qualifiedByName = "getOwnerEmail")
    @Mapping(source = "menus", target = "menusCount", qualifiedByName = "getMenusCount")
    @Mapping(source = "menus", target = "categoriesCount", qualifiedByName = "getCategoriesCount")
    @Mapping(source = "menus", target = "menuItemsCount", qualifiedByName = "getMenuItemsCount")
    @Mapping(source = "theme", target = "theme")
    @Mapping(source = "address", target = "address")
    @Mapping(source = "phone", target = "phone")
    @Mapping(source = "description", target = "description")
    RestaurantDto toDto(Restaurant restaurant);

    @Named("getOwnerEmail")
    default  String getOwnerEmail(User owner) {
        return owner.getEmail();
    }
    @Named("getMenusCount")
    default  Integer getMenusCount(List<Menu> menus) {
        return menus == null ? 0 : menus.size();
    }
    @Named("getCategoriesCount")
    default  Integer getCategoriesCount(List<Menu> menus) {
        int categories = 0;
        if (menus != null)
            for (Menu menu : menus) {
                if (menu.getCategories() != null)
                    categories += menu.getCategories().size();
            }
        return categories;
    }
    @Named("getMenuItemsCount")
    default  Integer getMenuItemsCount(List<Menu> menus) {
        int items = 0;
        if (menus != null) {
            Set<Category> categories = new HashSet<>();
            for (Menu menu : menus) {
                if (menu.getCategories() != null)
                    categories.addAll(menu.getCategories());
            }
            for (Category category : categories) {
                if (category.getMenuItems() != null)
                    items += category.getMenuItems().size();
            }
        }
        return items;
    }
}
