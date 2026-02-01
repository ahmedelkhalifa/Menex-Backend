package com.app.menex.menuItem.mappers;

import com.app.menex.menuItem.MenuItem;
import com.app.menex.menuItem.dtos.MenuItemDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;


@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
uses = com.app.menex.category.mappers.CategoryMapper.class)
public interface MenuItemMapper {

    @Mapping(source = "currency", target = "currency")
    MenuItemDto toDto(MenuItem item);

}
