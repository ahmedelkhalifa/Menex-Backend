package com.app.menex.publicAPI;

import com.app.menex.enums.Role;
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
        if (!restaurant.getOwner().isEnabled() || restaurant.getOwner().getRole().equals(Role.UNSUBSCRIBER))
                throw new IllegalArgumentException("Restaurant is not enabled");
        restaurant.setViews(restaurant.getViews() + 1);
        restaurantRepository.save(restaurant);
        restaurant.setMenus(restaurant.getMenus().stream().sorted(Comparator.comparing(Menu::getId)).toList());
        return mapper.toPublicRestaurant(restaurant);
    }


    public PublicMenuDto getMenu(String restaurantSlug, Long menuId) {
        Menu menu = menuRepository.findByIdAndRestaurantSlug(menuId, restaurantSlug).orElseThrow(
                () -> new EntityNotFoundException("Menu not found")
        );
        if (!menu.isActive() || !menu.getRestaurant().getOwner().isEnabled() ||
                menu.getRestaurant().getOwner().getRole().equals(Role.UNSUBSCRIBER))
            throw new IllegalStateException("Menu is not active");
        menu.setViews(menu.getViews() + 1);
        menuRepository.save(menu);
        return mapper.toPublicMenu(menu);
    }
}
