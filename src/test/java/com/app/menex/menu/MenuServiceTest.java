package com.app.menex.menu;

import com.app.menex.menu.dtos.MenuDto;
import com.app.menex.menu.mappers.MenuMapper;
import com.app.menex.user.UserService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class MenuServiceTest {
    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private MenuMapper menuMapper;

    @Autowired
    private UserService userService;

    @Test
    @Transactional
        // Important to keep lazy-loaded entities initialized
    void testMenuLoading() {
        Long menuId = 2L;
        Long ownerId = userService.getCurrentUser().getId();

        // Fetch menu using your repository method
        Menu menu = menuRepository.findByIdAndOwnerIdLoaded(menuId, ownerId)
                .orElseThrow(() -> new RuntimeException("Menu not found"));

        // Check if restaurant and owner are loaded
        System.out.println("Restaurant: " + menu.getRestaurant());
        System.out.println("Owner: " + menu.getRestaurant().getOwner());
        System.out.println("Owner email: " + menu.getRestaurant().getOwner().getEmail());

        // Optional: map to DTO
        MenuDto dto = menuMapper.toDto(menu);
        System.out.println("MenuDto restaurant ownerEmail: " + dto.getRestaurant().getOwnerEmail());
        System.out.println("MenuDto restaurant menusCount: " + dto.getRestaurant().getMenusCount());
    }
}