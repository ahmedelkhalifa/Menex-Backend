package com.app.menex.publicAPI;

import com.app.menex.menu.Menu;
import com.app.menex.menu.MenuRepository;
import com.app.menex.menu.dtos.MenuDto;
import com.app.menex.publicAPI.dtos.PublicMenuDto;
import com.app.menex.publicAPI.dtos.PublicRestaurantDto;
import com.app.menex.publicAPI.mappers.PublicAPIMapper;
import com.app.menex.restaurant.Restaurant;
import com.app.menex.restaurant.RestaurantRepository;
import com.app.menex.restaurant.dtos.RestaurantDto;
import com.app.menex.restaurant.mappers.RestaurantMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;

@Service
@RequiredArgsConstructor
public class publicAPIService {

    private final RestaurantRepository restaurantRepository;
    private final MenuRepository menuRepository;
    private final PublicAPIMapper mapper;

    public PublicRestaurantDto getRestaurant(String restaurantSlug) {
        Restaurant restaurant = restaurantRepository.findBySlug(restaurantSlug);
        if (restaurant == null) {
            throw new EntityNotFoundException("Restaurant not found");
        }
        restaurant.setMenus(restaurant.getMenus().stream().sorted(Comparator.comparing(Menu::getId)).toList());
        return mapper.toPublicRestaurant(restaurant);
    }


    public PublicMenuDto getMenu(String restaurantSlug, Long menuId) {
        Menu menu = menuRepository.findByIdAndRestaurantSlug(menuId, restaurantSlug).orElseThrow(
                () -> new EntityNotFoundException("Menu not found")
        );
        return mapper.toPublicMenu(menu);
    }
}
