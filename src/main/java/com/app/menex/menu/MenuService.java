package com.app.menex.menu;

import com.app.menex.restaurant.Restaurant;
import com.app.menex.restaurant.RestaurantRepository;
import com.app.menex.restaurant.RestaurantService;
import com.app.menex.user.User;
import com.app.menex.user.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final UserService userService;
    private final RestaurantRepository restaurantRepository;
    private final MenuRepository menuRepository;

    @Transactional
    public Menu createMenu(String name, Long restaurantId) throws AccessDeniedException {
        Restaurant restaurant = restaurantRepository.findById(restaurantId).orElseThrow(
                () -> new EntityNotFoundException("Restaurant with id: " + restaurantId + " not found"));
        User user = userService.getCurrentUser();
        if (!restaurant.getOwner().getId().equals(user.getId())) {
            throw new AccessDeniedException("You are not allowed to perform this action");
        }
        Menu menu = Menu.builder()
                .name(name)
                .active(true)
                .build();
        restaurant.addMenu(menu);
        restaurantRepository.save(restaurant);
        Menu createdMenu = restaurant.getMenus()
                .stream().filter(m -> m.getName().equals(name)).findFirst().get();
        return createdMenu;
    }

    @Transactional
    public Menu getMenu(Long id) throws AccessDeniedException {
        User user = userService.getCurrentUser();
        Menu menu = menuRepository.findByIdAndRestaurantOwnerId(id, user.getId())
                .orElseThrow(() -> new EntityNotFoundException("Menu with id: " + id + " not found"));
        return menu;
    }

    @Transactional
    public Set<Menu> getAllMenus(Long restaurantId) throws AccessDeniedException {
        User user = userService.getCurrentUser();
        Restaurant restaurant = restaurantRepository.findById(restaurantId).orElseThrow(
                () -> new EntityNotFoundException("Restaurant with id: " + restaurantId + " not found")
        );
        if (!restaurant.getOwner().getId().equals(user.getId())) {
            throw new AccessDeniedException("You are not allowed to perform this action");
        }
        return menuRepository.findAllByRestaurantId(restaurantId);
    }

    @Transactional
    public Menu updateMenu(String name, Long restaurantId, Long menuId) {
        User user = userService.getCurrentUser();
        Menu menu = menuRepository.findByIdAndRestaurantOwnerId(menuId, user.getId()).orElseThrow(
                () -> new EntityNotFoundException("Menu with id: " + menuId + " not found")
        );
        menu.setName(name);

        if (restaurantId != null) {
            Restaurant newRestaurant = restaurantRepository.findByIdAndOwnerId(restaurantId, user.getId()).orElseThrow(
                    () -> new EntityNotFoundException("Restaurant with id: " + restaurantId + " not found")
            );
            Restaurant oldRestaurant = menu.getRestaurant();
            if (oldRestaurant != null) {
                oldRestaurant.removeMenu(menu);
            }
            newRestaurant.addMenu(menu);
        }
        return menu;
    }

    @Transactional
    public void deleteMenu(Long menuId) {
        User user = userService.getCurrentUser();
        Menu menu = menuRepository.findByIdAndRestaurantOwnerId(menuId, user.getId()).orElseThrow(
                () -> new EntityNotFoundException("Menu with id: " + menuId + " not found")
        );
        menu.getRestaurant().removeMenu(menu);
    }
}
