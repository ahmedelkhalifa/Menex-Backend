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
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.nio.file.*;
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
    public Menu createMenu(String name, String description, Long restaurantId, MultipartFile image) throws IOException {
        Restaurant restaurant = restaurantRepository.findById(restaurantId).orElseThrow(
                () -> new EntityNotFoundException("Restaurant with id: " + restaurantId + " not found"));
        User user = userService.getCurrentUser();
        if (!restaurant.getOwner().getId().equals(user.getId())) {
            throw new AccessDeniedException("You are not allowed to perform this action");
        }
        Menu menu = Menu.builder()
                .name(name)
                .description(description)
                .active(true)
                .build();
        restaurant.addMenu(menu);

        menuRepository.saveAndFlush(menu);
        Long id = restaurant.getId();
        String filename = "menu-" + menu.getId();
        Path restaurantDir = Paths.get(uploadDir , id.toString());
        Path menuDir = restaurantDir.resolve(filename);
        Files.createDirectories(menuDir);

        if (image != null && !image.isEmpty()) {
            String imageName = "image." + StringUtils.getFilenameExtension(image.getOriginalFilename());
            Files.copy(image.getInputStream(), menuDir.resolve(imageName), StandardCopyOption.REPLACE_EXISTING);
            String resId = menu.getRestaurant().getId().toString();
            String menuPath = "menu-" + menu.getId();
            menu.setImageUrl(resId + "/" + menuPath + "/" + imageName);
        }
        return menu;
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
    public Menu updateMenu(String name, String description, Long restaurantId, Long menuId,
                           MultipartFile image) throws IOException {
        User user = userService.getCurrentUser();
        Menu menu = menuRepository.findByIdAndRestaurantOwnerId(menuId, user.getId()).orElseThrow(
                () -> new EntityNotFoundException("Menu with id: " + menuId + " not found")
        );
        menu.setName(name);
        menu.setDescription(description);

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
        if (image != null && !image.isEmpty()) {
            if (menu.getImageUrl() != null && !menu.getImageUrl().isEmpty()) {
                Path oldImagePath = Paths.get(uploadDir , menu.getImageUrl());
                Files.deleteIfExists(oldImagePath);
            }
            Path menuDir = Paths.get(uploadDir).resolve(menu.getRestaurant().getId().toString())
                    .resolve("menu-" + menu.getId());
            String imageName = "image." + StringUtils.getFilenameExtension(image.getOriginalFilename());
            Path imagePath = menuDir.resolve(imageName);
            Files.copy(image.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);
            String resId = menu.getRestaurant().getId().toString();
            String menuPath = "menu-" + menu.getId();
            menu.setImageUrl(resId + "/" + menuPath + "/" + imageName);
        } else {
            Path imagePath = Paths.get(uploadDir , menu.getImageUrl());
            Files.deleteIfExists(imagePath);
            menu.setImageUrl(null);
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
