package com.app.menex.restaurant.mappers;

import com.app.menex.menu.Menu;
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

import java.util.Set;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
uses = ThemeMapper.class)
public interface RestaurantMapper {

    @Mapping(source = "owner", target = "ownerEmail", qualifiedByName = "getOwnerEmail")
    @Mapping(source = "menus", target = "menusCount", qualifiedByName = "getMenusCount")
    @Mapping(source = "theme", target = "theme")
    @Mapping(source = "address", target = "address")
    @Mapping(source = "phone", target = "phone")
    RestaurantDto toDto(Restaurant restaurant);

    @Named("getOwnerEmail")
    default  String getOwnerEmail(User owner) {
        return owner.getEmail();
    }
    @Named("getMenusCount")
    default  Integer getMenusCount(Set<Menu> menus) {
        return menus == null ? 0 : menus.size();
    }
}
