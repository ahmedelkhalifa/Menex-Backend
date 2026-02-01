package com.app.menex.menuItem;

import com.app.menex.menuItem.dtos.MenuItemDto;
import com.app.menex.menuItem.mappers.MenuItemMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class MenuItemController {

    private final MenuItemService menuItemService;
    private final MenuItemMapper menuItemMapper;

    @PostMapping(value = "/categories/{categoryId}/menu-items",
    consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MenuItemDto> createMenuItem(
            @PathVariable Long categoryId,
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam BigDecimal price,
            @RequestParam Currency currency,
            @RequestParam(required = false) MultipartFile image
            ) throws IOException {
        MenuItem item = menuItemService.createMenuItem(
                name, description, price, image, categoryId, currency
        );
        MenuItemDto dto = menuItemMapper.toDto(item);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @GetMapping("categories/{categoryId}/menu-items")
    public ResponseEntity<List<MenuItemDto>> getAllMenuItems(@PathVariable Long categoryId) throws AccessDeniedException {
        List<MenuItem> items = menuItemService.getAllItemsByCategory(categoryId);
        List<MenuItemDto> dtos = items.stream().map(menuItemMapper::toDto).toList();
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @PutMapping(value = "/categories/{categoryId}/menu-items/{itemId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MenuItemDto> updateMenuItem(
            @PathVariable Long categoryId,
            @PathVariable Long itemId,
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam BigDecimal price,
            @RequestParam Currency currency,
            @RequestParam(required = false) MultipartFile image
    ) throws IOException {
        MenuItem item = menuItemService.updateMenuItem(
                itemId, name, description, price, image, categoryId, currency
        );
        MenuItemDto dto = menuItemMapper.toDto(item);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @PutMapping("menu-items/{itemId}/unavailable")
    public ResponseEntity unavailableMenuItem(@PathVariable Long itemId) {
        menuItemService.unavailableItem(itemId);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    @PutMapping("menu-items/{itemId}/available")
    public ResponseEntity availableMenuItem(@PathVariable Long itemId) {
        menuItemService.availableItem(itemId);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("menu-items/{itemId}")
    public ResponseEntity deleteMenuItem(@PathVariable Long itemId) throws IOException {
        menuItemService.deleteMenuItem(itemId);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }
}
