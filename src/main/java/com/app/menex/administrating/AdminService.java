package com.app.menex.administrating;

import com.app.menex.administrating.dtos.DashboardDetails;
import com.app.menex.administrating.dtos.OwnerDashboardDetails;
import com.app.menex.administrating.dtos.ViewsDetails;
import com.app.menex.administrating.dtos.ViewsPerRes;
import com.app.menex.category.Category;
import com.app.menex.category.CategoryRepository;
import com.app.menex.enums.Role;
import com.app.menex.menu.Menu;
import com.app.menex.menu.MenuRepository;
import com.app.menex.menuItem.MenuItem;
import com.app.menex.menuItem.MenuItemRepository;
import com.app.menex.restaurant.Restaurant;
import com.app.menex.restaurant.RestaurantRepository;
import com.app.menex.user.User;
import com.app.menex.user.UserRepository;
import com.app.menex.user.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final MenuRepository menuRepository;
    private final CategoryRepository categoryRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserService userService;

    public DashboardDetails getAdminDashboardDetails(){
        List<User> users = userRepository.findAllByRole(Role.RESTAURANT_OWNER);
        List<User> unsubscribedUsers = userRepository.findAllByRole(Role.UNSUBSCRIBER);
        List<Restaurant> restaurants = restaurantRepository.findAll();
        List<Menu> menus = menuRepository.findAll();
        List<Category> categories = categoryRepository.findAll();
        List<MenuItem> menuItems = menuItemRepository.findAll();
        List<User> admins = userRepository.findAllByRole(Role.SUPER_ADMIN);
        return DashboardDetails.builder()
                .usersCount(users.size() +  unsubscribedUsers.size())
                .restaurantsCount(restaurants.size())
                .categoriesCount(categories.size())
                .menuItemsCount(menuItems.size())
                .menusCount(menus.size())
                .adminsCount(admins.size())
                .build();
    }

    @Transactional
    public OwnerDashboardDetails getOwnerDashboardDetails(){
        User user = userService.getCurrentUser();
        List<Restaurant> restaurants = restaurantRepository.findAllByOwnerIdOrderByIdAsc(user.getId());
        List<Menu> menus = menuRepository.findAllByRestaurantOwnerId(user.getId());
        List<Category> categories = categoryRepository.findAllByMenuRestaurantOwnerId(user.getId());
        List<MenuItem> menuItems = menuItemRepository.findAllByCategoryMenuRestaurantOwnerId(user.getId());
        return OwnerDashboardDetails.builder()
                .restaurantsCount(restaurants.size())
                .categoriesCount(categories.size())
                .menuItemsCount(menuItems.size())
                .menusCount(menus.size())
                .build();
    }

    @Transactional(readOnly = true)
    public ViewsDetails getViews() {
        User currentUser = userService.getCurrentUser();
        List<Restaurant> restaurants = restaurantRepository.findAllByOwnerIdOrderByIdAsc(currentUser.getId());
        List<Menu> menus = menuRepository.findAllByRestaurantOwnerId(currentUser.getId());
        Integer restaurantViews = restaurants.stream()
                .mapToInt(Restaurant::getViews).sum();
        Integer menusViews = menus.stream().mapToInt(Menu::getViews).sum();
        HashMap<String, Integer> perMenuViews = new HashMap<>();
        for (Menu menu : menus) {
            perMenuViews.put(menu.getName(), menu.getViews());
        }
        ViewsDetails viewsDetails = ViewsDetails.builder()
                .menusViews(menusViews)
                .restaurantViews(restaurantViews)
                .totalViews(menusViews + restaurantViews)
                .build();
        return viewsDetails;
    }

    @Transactional(readOnly = true)
    public HashMap<String, Long> getRestaurants() {
        User currentUser = userService.getCurrentUser();
        List<Restaurant> restaurants = restaurantRepository.findAllByOwnerIdOrderByIdAsc(currentUser.getId());
        HashMap<String, Long> restaurantsMap = new HashMap<>();
        for (Restaurant restaurant : restaurants) {
            restaurantsMap.put(restaurant.getName(), restaurant.getId());
        }
        return restaurantsMap;
    }

    public ViewsPerRes getDetailedViews(Long restaurantId) {
        List<Menu> menus = menuRepository.findAllByRestaurantIdOrderByIdAsc(restaurantId);
        Restaurant restaurant = restaurantRepository.findById(restaurantId).orElseThrow(
                () -> new EntityNotFoundException("restaurant not found")
        );
        HashMap<String, Integer> perMenuViews = new HashMap<>();
        Integer menusViews = menus.stream().mapToInt(Menu::getViews).sum();
        Integer restaurantViews = restaurant.getViews();
        for (Menu menu : menus) {
            perMenuViews.put(menu.getName(), menu.getViews());
        }
        ViewsPerRes viewsPerRes = ViewsPerRes.builder()
                .restaurantViews(restaurantViews)
                .totalViews(menusViews + restaurantViews)
                .perMenuViews(perMenuViews)
                .build();
        return viewsPerRes;
    }
}
