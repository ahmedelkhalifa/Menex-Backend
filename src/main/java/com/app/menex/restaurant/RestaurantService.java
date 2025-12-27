package com.app.menex.restaurant;

import com.app.menex.theme.Theme;
import com.app.menex.user.User;
import com.app.menex.user.UserRepository;
import com.app.menex.user.UserService;
import com.github.slugify.Slugify;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final UserService userService;

    public Restaurant createRestaurant(String name, String primaryColor, String secondaryColor, String font) {

        User user = userService.getCurrentUser();

        Slugify slugify = new Slugify();
        String baseSlug = slugify.slugify(name.toLowerCase());
        String slug = baseSlug;
        int counter = 1;
        while (restaurantRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + counter++;
        }

        Theme theme = Theme.builder()
                .primaryColor(primaryColor)
                .secondaryColor(secondaryColor)
                .font(font)
                .build();

        Restaurant restaurant = Restaurant.builder()
                .name(name.toLowerCase())
                .slug(slug)
                .owner(user)
                .theme(theme)
                .build();
        return  restaurantRepository.save(restaurant);
    }

    public Restaurant getRestaurant(Long id) {
        return restaurantRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Restaurant not found with id: " + id)
        );
    }

    public Set<Restaurant> getAllRestaurantsForCurrentUser() {
        User user = userService.getCurrentUser();
        return restaurantRepository.findAllByOwnerId(user.getId());
    }

    @Transactional
    @Modifying
    public Restaurant updateRestaurant(Long id, String name, String primaryColor, String secondaryColor, String font) {

        Slugify slugify = new Slugify();
        String baseSlug = slugify.slugify(name.toLowerCase());
        String slug = baseSlug;
        int counter = 1;
        while (restaurantRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + counter++;
        }

        Restaurant restaurant = restaurantRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Restuarnat with the name: " + name + " not found")
        );
        restaurant.setName(name);
        restaurant.setSlug(slug);
        restaurant.setTheme(Theme.builder()
                .primaryColor(primaryColor)
                .secondaryColor(secondaryColor)
                .font(font)
                .build());
        return restaurantRepository.save(restaurant);
    }

    @Transactional
    public void deleteRestaurant(Long id) throws AccessDeniedException {
        Restaurant restaurant = restaurantRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Restaurant not found with id: " + id)
        );
        User user = userService.getCurrentUser();
        if (restaurant.getOwner().getId().equals(user.getId())) {
            restaurantRepository.deleteById(id);
        } else {
            throw new AccessDeniedException("You are not the owner of the restaurant");
        }
    }
}
