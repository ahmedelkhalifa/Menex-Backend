package com.app.menex.administrating;

import com.app.menex.administrating.dtos.DashboardDetails;
import com.app.menex.administrating.dtos.OwnerDashboardDetails;
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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
        List<Restaurant> restaurants = restaurantRepository.findAll();
        List<Menu> menus = menuRepository.findAll();
        List<Category> categories = categoryRepository.findAll();
        List<MenuItem> menuItems = menuItemRepository.findAll();
        List<User> admins = userRepository.findAllByRole(Role.SUPER_ADMIN);
        return DashboardDetails.builder()
                .usersCount(users.size())
                .restaurantsCount(restaurants.size())
                .categoriesCount(categories.size())
                .menuItemsCount(menuItems.size())
                .menusCount(menus.size())
                .adminsCount(admins.size())
                .build();
    }

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
}
