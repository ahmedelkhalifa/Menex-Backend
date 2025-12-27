package com.app.menex.restaurant;

import com.app.menex.restaurant.dtos.CreateRestaurantRequest;
import com.app.menex.restaurant.dtos.RestaurantDto;
import com.app.menex.restaurant.mappers.RestaurantMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/restaurant")
public class RestaurantController {

    private final RestaurantService restaurantService;
    private final RestaurantMapper restaurantMapper;

    @PostMapping
    public ResponseEntity<RestaurantDto> createRestaurant(@Valid @RequestBody CreateRestaurantRequest request) {
        Restaurant createdRestaurant = restaurantService.createRestaurant(
                request.getRestaurantName(),request.getPrimaryColor(),
                request.getSecondaryColor(), request.getFont()
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
    public ResponseEntity<Set<RestaurantDto>> getAllRestaurantsForCurrentUser() {
        Set<Restaurant> restaurants = restaurantService.getAllRestaurantsForCurrentUser();
        Set<RestaurantDto> dtos = restaurants.stream().map(restaurantMapper::toDto).collect(Collectors.toSet());
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RestaurantDto> updateRestaurant(@Valid @RequestBody CreateRestaurantRequest request
    , @PathVariable Long id) {
        Restaurant restaurant = restaurantService.updateRestaurant(id, request.getRestaurantName(),
                request.getPrimaryColor(), request.getSecondaryColor(), request.getFont());
        RestaurantDto restaurantDto = restaurantMapper.toDto(restaurant);
        return new ResponseEntity<>(restaurantDto, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteRestaurant(@PathVariable Long id) throws AccessDeniedException {
        restaurantService.deleteRestaurant(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
