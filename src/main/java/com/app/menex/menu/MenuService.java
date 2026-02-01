package com.app.menex.menu;

import com.app.menex.restaurant.Restaurant;
import com.app.menex.restaurant.RestaurantRepository;
import com.app.menex.restaurant.RestaurantService;
import com.app.menex.user.User;
import com.app.menex.user.UserService;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.AccessDeniedException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final UserService userService;
    private final RestaurantRepository restaurantRepository;
    private final MenuRepository menuRepository;
    @Value("${app.upload.dir}")
    private String uploadDir;

    @Transactional
    public Menu createMenu(String name, Long restaurantId) throws IOException {
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
        restaurantRepository.saveAndFlush(restaurant);
        Menu createdMenu = restaurant.getMenus().stream().filter(m -> m.getName().equals(menu.getName()))
                .findFirst().get();
        Long id = restaurant.getId();
        String filename = "menu-" + createdMenu.getId();
        Path restaurantDir = Paths.get(uploadDir , id.toString());
        Path menuDir = restaurantDir.resolve(filename);
        Files.createDirectories(menuDir);
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
    public List<Menu> getAllMenus(Long restaurantId) throws AccessDeniedException {
        User user = userService.getCurrentUser();
        Restaurant restaurant = restaurantRepository.findById(restaurantId).orElseThrow(
                () -> new EntityNotFoundException("Restaurant with id: " + restaurantId + " not found")
        );
        if (!restaurant.getOwner().getId().equals(user.getId())) {
            throw new AccessDeniedException("You are not allowed to perform this action");
        }
        return menuRepository.findAllByRestaurantIdOrderByIdAsc(restaurantId);
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
    public void deleteMenu(Long menuId) throws IOException {
        User user = userService.getCurrentUser();
        Menu menu = menuRepository.findByIdAndRestaurantOwnerId(menuId, user.getId()).orElseThrow(
                () -> new EntityNotFoundException("Menu with id: " + menuId + " not found")
        );
        Path menuDir = Paths.get(uploadDir , menu.getRestaurant().getId().toString(),
                "menu-" + menuId.toString());
        menu.getRestaurant().removeMenu(menu);
        deleteDirectory(menuDir);
    }

    private void deleteDirectory(Path dir) throws IOException {
        if (Files.notExists(dir)) return;
        Files.walk(dir)
                .sorted(Comparator.reverseOrder())
                .forEach(p -> {
                    try {
                        Files.delete(p);
                    } catch (IOException e) {
                        throw new UncheckedIOException(e);
                    }
                });
    }

    @Transactional
    public void disableMenu(Long menuId) {
        Menu menu = menuRepository.findById(menuId).orElseThrow(
                () -> new EntityNotFoundException("Menu with id: " + menuId + " not found")
        );
        menu.setActive(false);
        menuRepository.save(menu);
    }

    @Transactional
    public void enableMenu(Long menuId) {
        Menu menu = menuRepository.findById(menuId).orElseThrow(
                () -> new EntityNotFoundException("Menu with id: " + menuId + " not found")
        );
        menu.setActive(true);
        menuRepository.save(menu);
    }

    public byte[] generateMenuQRCode(String link) throws Exception {
        QRCodeWriter writer = new QRCodeWriter();
        BitMatrix matrix = writer.encode(link, BarcodeFormat.QR_CODE, 300, 300);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(matrix, "png", baos);
        return baos.toByteArray();
    }
}
