package com.app.menex.restaurant;

import com.app.menex.restaurant.dtos.CreateRestaurantRequest;
import com.app.menex.restaurant.dtos.RestaurantDto;
import com.app.menex.restaurant.mappers.RestaurantMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;
    private final RestaurantMapper restaurantMapper;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RestaurantDto> createRestaurant(
            @RequestParam String name,
            @RequestParam String address,
            @RequestParam String phone,
            @RequestParam String primaryColor,
            @RequestParam String secondaryColor,
            @RequestParam String textPrimary,
            @RequestParam String textSecondary,
            @RequestParam String font,
            @RequestParam(required = false) MultipartFile logo
            ) throws IOException {
        Restaurant createdRestaurant = restaurantService.createRestaurant(
                name, address, phone, primaryColor, secondaryColor, textPrimary,
                textSecondary, font, logo
        );
        RestaurantDto restaurantDto = restaurantMapper.toDto(createdRestaurant);
        return new ResponseEntity<>(restaurantDto, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantDto> getRestaurant(@PathVariable Long id) {
        Restaurant restaurant = restaurantService.getRestaurant(id);
        RestaurantDto restaurantDto = restaurantMapper.toDto(restaurant);
        return new ResponseEntity<>(restaurantDto, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<RestaurantDto>> getAllRestaurantsForCurrentUser() {
        List<Restaurant> restaurants = restaurantService.getAllRestaurantsForCurrentUser();
        List<RestaurantDto> dtos = restaurants.stream().map(restaurantMapper::toDto).toList();
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RestaurantDto> updateRestaurant(
            @RequestParam String name,
            @RequestParam String address,
            @RequestParam String phone,
            @RequestParam String primaryColor,
            @RequestParam String secondaryColor,
            @RequestParam String textPrimary,
            @RequestParam String textSecondary,
            @RequestParam String font,
            @RequestParam(required = false) MultipartFile logo,
            @PathVariable Long id
    ) throws IOException {
        Restaurant updatedRestaurant = restaurantService.updateRestaurant(
                name, address, phone, primaryColor, secondaryColor, textPrimary,
                textSecondary, font, logo, id
        );
        RestaurantDto restaurantDto = restaurantMapper.toDto(updatedRestaurant);
        return new ResponseEntity<>(restaurantDto, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteRestaurant(@PathVariable Long id) throws IOException {
        restaurantService.deleteRestaurant(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
