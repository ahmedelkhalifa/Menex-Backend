package com.app.menex.publicAPI;

import com.app.menex.menu.dtos.MenuDto;
import com.app.menex.publicAPI.dtos.PublicMenuDto;
import com.app.menex.publicAPI.dtos.PublicRestaurantDto;
import com.app.menex.restaurant.dtos.RestaurantDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/public")
@RequiredArgsConstructor
public class PublicAPIController {
    private final publicAPIService publicAPIService;

    @GetMapping("restaurants/{restaurantSlug}")
    public ResponseEntity<PublicRestaurantDto> getRestaurant(@PathVariable String restaurantSlug) {
        PublicRestaurantDto restaurant =  publicAPIService.getRestaurant(restaurantSlug);
        return ResponseEntity.ok(restaurant);
    }
    @GetMapping("restaurants/{restaurantSlug}/menus/{menuId}")
    public ResponseEntity<PublicMenuDto> getMenu(@PathVariable String restaurantSlug, @PathVariable Long menuId) {
        PublicMenuDto menu = publicAPIService.getMenu(restaurantSlug, menuId);
        return ResponseEntity.ok(menu);
    }
}
