package com.app.menex.menu.mappers;

import com.app.menex.category.Category;
import com.app.menex.menu.Menu;
import com.app.menex.menu.dtos.MenuDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
uses = {com.app.menex.restaurant.mappers.RestaurantMapper.class})
public interface MenuMapper {

    @Mapping(source = "categories", target = "categoriesCount", qualifiedByName = "getCategoriesCount")
    @Mapping(source = "restaurant", target = "restaurant")
    @Mapping(source = "id", target = "id")
    MenuDto toDto(Menu menu);

    @Named("getCategoriesCount")
    default Integer getCategoriesCount(List<Category> categories) {
        return categories ==  null ? 0 : categories.size();
    }
}
