package com.app.menex.menuItem;

import com.app.menex.category.Category;
import com.app.menex.category.CategoryRepository;
import com.app.menex.menu.Menu;
import com.app.menex.user.User;
import com.app.menex.user.UserService;
import com.luciad.imageio.webp.WebPWriteParam;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriter;
import javax.imageio.stream.FileImageOutputStream;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.math.BigDecimal;
import java.nio.file.*;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuItemService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    private final MenuItemRepository menuItemRepository;
    private final CategoryRepository categoryRepository;
    private final UserService  userService;

    @Transactional
    public MenuItem createMenuItem(String name, String description, BigDecimal price, MultipartFile image,
                                   Long categoryId, Currency currency) throws IOException {
        Category category = categoryRepository.findById(categoryId).orElseThrow(
                () -> new EntityNotFoundException("Category with id: " + categoryId + "not found")
        );
        MenuItem item = MenuItem.builder()
                .name(name)
                .description(description)
                .price(price)
                .available(true)
                .currency(currency)
                .build();
        category.addMenuItem(item);
        menuItemRepository.saveAndFlush(item);

        if (image != null && !image.isEmpty()) {
            String fileName = "item-" + item.getId() + ".webp";
            String menuPath = "menu-" + category.getMenu().getId().toString();
            String restaurantPath = category.getMenu().getRestaurant().getId().toString();
            Path itemDir = Paths.get(uploadDir).resolve(restaurantPath).resolve(menuPath);
            Path itemPath = itemDir.resolve(fileName);
            Files.createDirectories(itemDir);
            // 2. Read and Resize
            BufferedImage originalImage = ImageIO.read(image.getInputStream());
            int targetWidth = 800; // Professional standard for mobile menus
            int targetHeight = (int) (originalImage.getHeight() * (targetWidth / (double) originalImage.getWidth()));

            BufferedImage resizedImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_ARGB);
            Graphics2D g2d = resizedImage.createGraphics();
            g2d.drawImage(originalImage, 0, 0, targetWidth, targetHeight, null);
            g2d.dispose();

            // 3. Encode as WebP with Quality Control
            ImageWriter writer = ImageIO.getImageWritersByFormatName("webp").next();
            WebPWriteParam writeParam = new WebPWriteParam(writer.getLocale());
            writeParam.setCompressionMode(WebPWriteParam.MODE_EXPLICIT);
            writeParam.setCompressionType(writeParam.getCompressionTypes()[WebPWriteParam.LOSSY_COMPRESSION]);
            writeParam.setCompressionQuality(0.75f); // 0.75 is the "sweet spot" for size/quality

            try (FileImageOutputStream output = new FileImageOutputStream(itemPath.toFile())) {
                writer.setOutput(output);
                writer.write(null, new IIOImage(resizedImage, null, null), writeParam);
            } finally {
                writer.dispose();
            }
            item.setImageUrl(restaurantPath + "/" + menuPath + "/" + fileName);
        }
        return item;
    }

    @Transactional
    public void deleteMenuItem(Long itemId) throws IOException {
        User user = userService.getCurrentUser();
        MenuItem item = menuItemRepository.findByIdAndCategoryMenuRestaurantOwnerId(itemId, user.getId()).orElseThrow(
                () -> new EntityNotFoundException("Item with id: " + itemId + " not found")
        );
        if (item.getImageUrl() != null) {
            Path itemPath = Paths.get(uploadDir).resolve(item.getImageUrl());
            Files.deleteIfExists(itemPath);
        };
        item.getCategory().removeMenuItem(item);
    }

    public List<MenuItem> getAllItemsByCategory(Long categoryId) throws AccessDeniedException {
        User user = userService.getCurrentUser();
        Category category = categoryRepository.findById(categoryId).orElseThrow(
                () -> new EntityNotFoundException("Category with id: " + categoryId + "not found")
        );
        if (!category.getMenu().getRestaurant().getOwner().getId().equals(user.getId())) {
            throw new AccessDeniedException("You are not allowed to perform this action");
        }
        return menuItemRepository.findAllByCategoryOrderByIdAsc(category);
    }

    @Transactional
    public MenuItem updateMenuItem(Long itemId, String name, String description,
                                   BigDecimal price, MultipartFile image, Long categoryId, Currency currency,
                                   Boolean deleteImg) throws IOException {
        MenuItem item = menuItemRepository.findById(itemId).orElseThrow(
                () -> new EntityNotFoundException("Item with id: " + itemId + "not found")
        );
        item.setName(name);
        item.setDescription(description);
        item.setPrice(price);
        item.setCurrency(currency);
        if (image != null && !image.isEmpty()) {
            if (item.getImageUrl() != null) {
                Path oldImagePath = Paths.get(uploadDir).resolve(item.getImageUrl());
                Files.deleteIfExists(oldImagePath);
            }
            String fileName = "item-" + item.getId() + ".webp";
            String menuPath = "menu-" + item.getCategory().getMenu().getId().toString();
            String restaurantPath = item.getCategory().getMenu().getRestaurant().getId().toString();
            Path itemDir = Paths.get(uploadDir).resolve(restaurantPath).resolve(menuPath);
            Path itemPath = itemDir.resolve(fileName);
            Files.createDirectories(itemDir);
            // 2. Read and Resize
            BufferedImage originalImage = ImageIO.read(image.getInputStream());
            int targetWidth = 800; // Professional standard for mobile menus
            int targetHeight = (int) (originalImage.getHeight() * (targetWidth / (double) originalImage.getWidth()));

            BufferedImage resizedImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_ARGB);
            Graphics2D g2d = resizedImage.createGraphics();
            g2d.drawImage(originalImage, 0, 0, targetWidth, targetHeight, null);
            g2d.dispose();

            // 3. Encode as WebP with Quality Control
            ImageWriter writer = ImageIO.getImageWritersByFormatName("webp").next();
            WebPWriteParam writeParam = new WebPWriteParam(writer.getLocale());
            writeParam.setCompressionMode(WebPWriteParam.MODE_EXPLICIT);
            writeParam.setCompressionType(writeParam.getCompressionTypes()[WebPWriteParam.LOSSY_COMPRESSION]);
            writeParam.setCompressionQuality(0.75f); // 0.75 is the "sweet spot" for size/quality

            try (FileImageOutputStream output = new FileImageOutputStream(itemPath.toFile())) {
                writer.setOutput(output);
                writer.write(null, new IIOImage(resizedImage, null, null), writeParam);
            } finally {
                writer.dispose();
            }
            item.setImageUrl(restaurantPath + "/" + menuPath + "/" + fileName);
        } else if (Boolean.TRUE.equals(deleteImg)) {
            Path itemPath = Paths.get(uploadDir).resolve(item.getImageUrl());
            Files.deleteIfExists(itemPath);
            item.setImageUrl(null);
        }
        if (!categoryId.equals(item.getCategory().getId())) {
            throw new AccessDeniedException("You are not allowed to perform this action");
        }
        return menuItemRepository.save(item);
    }

    @Transactional
    public void unavailableItem(Long itemId) {
        MenuItem item = menuItemRepository.findById(itemId).orElseThrow(
                () -> new EntityNotFoundException("Item with id: " + itemId + "not found")
        );
        item.setAvailable(false);
        menuItemRepository.save(item);
    }
    @Transactional
    public void availableItem(Long itemId) {
        MenuItem item = menuItemRepository.findById(itemId).orElseThrow(
                () -> new EntityNotFoundException("Item with id: " + itemId + "not found")
        );
        item.setAvailable(true);
        menuItemRepository.save(item);
    }
}
