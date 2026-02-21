package com.app.menex.restaurant;

import com.app.menex.enums.Role;
import com.app.menex.payment.model.Plan;
import com.app.menex.payment.model.SubscriptionStatus;
import com.app.menex.payment.model.UserSubscription;
import com.app.menex.payment.repository.UserSubscriptionRespository;
import com.app.menex.theme.Theme;
import com.app.menex.user.User;
import com.app.menex.user.UserRepository;
import com.app.menex.user.UserService;
import com.github.slugify.Slugify;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.*;
import java.util.Comparator;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final UserService userService;
    private final UserSubscriptionRespository repository;
    private final UserRepository userRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Transactional
    public Restaurant createRestaurant(String name,
                                       String address,
                                       String phone,
                                       String primaryColor,
                                       String secondaryColor,
                                       String textPrimary,
                                       String textSecondary,
                                       String background,
                                       String backgroundCard,
                                       String font,
                                       MultipartFile logo,
                                       Long userId,
                                       String description) throws IOException {

        long currentCount = restaurantRepository.countByOwnerId(userId);
        int max = 0;
        UserSubscription sub = repository.findTopByUserIdAndStatusOrderByEndDateDesc(userId, SubscriptionStatus.ACTIVE).orElseThrow(
                () -> new EntityNotFoundException("no active subscriptions")
        );
        Plan plan = sub.getPlan();
        switch (plan) {
            case STARTER -> {
                max = 1;
                break;
            }
            case PRO -> {
                max = 3;
                break;
            }
            case ENTERPRISE -> {
                max = Integer.MAX_VALUE;
                break;
            }
        }
        if (currentCount >= max) {
            throw new BadRequestException("You have reached the limit of %d restaurants".formatted(max));
        }

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
                .textPrimary(textPrimary)
                .textSecondary(textSecondary)
                .background(background)
                .backgroundCard(backgroundCard)
                .font(font)
                .build();

        Restaurant restaurant = Restaurant.builder()
                .name(name.trim())
                .slug(slug)
                .owner(userRepository.findById(userId).get())
                .theme(theme)
                .address(address)
                .phone(phone)
                .views(0)
                .description(description)
                .build();
        restaurantRepository.saveAndFlush(restaurant);
        Long id = restaurant.getId();
        Path restaurantDir = Paths.get(uploadDir , id.toString());
        Files.createDirectories(restaurantDir);

        if (logo != null && !logo.isEmpty()) {
            String fileName = "logo." + StringUtils.getFilenameExtension(logo.getOriginalFilename());
            Path logoPath = restaurantDir.resolve(fileName);
            Files.copy(logo.getInputStream(), logoPath, StandardCopyOption.REPLACE_EXISTING);
            restaurant.setLogoUrl(id + "/" + fileName);
        }
        return restaurantRepository.save(restaurant);
    }

    public Restaurant getRestaurant(Long id) {
        return restaurantRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Restaurant not found with id: " + id)
        );
    }

    public List<Restaurant> getAllRestaurantsForCurrentUser() {
        User user = userService.getCurrentUser();
        return restaurantRepository.findAllByOwnerIdOrderByIdAsc(user.getId());
    }

    @Transactional
    public Restaurant updateRestaurant(String name,
                                       String address,
                                       String phone,
                                       String primaryColor,
                                       String secondaryColor,
                                       String textPrimary,
                                       String textSecondary,
                                       String background,
                                       String backgroundCard,
                                       String font,
                                       MultipartFile logo,
                                       Long id,
                                       String description) throws IOException {




        Restaurant restaurant = restaurantRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Restuarnat with the name: " + name + " not found")
        );
        Slugify slugify = new Slugify();
        String baseSlug = slugify.slugify(name.toLowerCase());
        String slug = baseSlug;
        if (!restaurant.getName().equals(name)) {
            int counter = 1;
            while (restaurantRepository.existsBySlug(slug)) {
                slug = baseSlug + "-" + counter++;
            }
        }
        Theme theme = restaurant.getTheme();
        theme.setPrimaryColor(primaryColor);
        theme.setSecondaryColor(secondaryColor);
        theme.setTextPrimary(textPrimary);
        theme.setTextSecondary(textSecondary);
        theme.setBackground(background);
        theme.setBackgroundCard(backgroundCard);
        theme.setFont(font);
        restaurant.setName(name);
        restaurant.setSlug(slug);
        restaurant.setTheme(theme);
        restaurant.setAddress(address);
        restaurant.setPhone(phone);
        restaurant.setDescription(description);

        Path restaurantDir = Paths.get(uploadDir , id.toString());
        Files.createDirectories(restaurantDir);

        if (logo != null && !logo.isEmpty()) {
            String fileName = "logo." + StringUtils.getFilenameExtension(logo.getOriginalFilename());
            Path logoPath = restaurantDir.resolve(fileName);
            Files.copy(logo.getInputStream(), logoPath, StandardCopyOption.REPLACE_EXISTING);
            restaurant.setLogoUrl(id + "/" + fileName);
        }
        return restaurantRepository.save(restaurant);
    }

    @Transactional
    public void deleteRestaurant(Long id) throws IOException {
        Restaurant restaurant = restaurantRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Restaurant not found with id: " + id)
        );
        User user = userService.getCurrentUser();
        if (restaurant.getOwner().getId().equals(user.getId()) || user.getRole().equals(Role.SUPER_ADMIN)) {
            restaurantRepository.deleteById(id);
            Path restuarantPath = Paths.get(uploadDir , id.toString());
            deleteDirectory(restuarantPath);
        } else {
            throw new AccessDeniedException("You are not the owner of the restaurant");
        }
    }

    private void deleteDirectory(Path path) throws IOException {
        if (Files.notExists(path)) return;
        Files.walk(path)
                .sorted(Comparator.reverseOrder())
                .forEach(p -> {
                    try {
                        Files.delete(p);
                    } catch (IOException e) {
                        throw new UncheckedIOException(e);
                    }
                });
    }

    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }
}
