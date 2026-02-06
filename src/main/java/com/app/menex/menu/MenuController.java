package com.app.menex.menu;

import com.app.menex.menu.dtos.CreateMenuRequest;
import com.app.menex.menu.dtos.MenuDto;
import com.app.menex.menu.dtos.UpdateMenuRequest;
import com.app.menex.menu.mappers.MenuMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
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
@RequestMapping("api")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;
    private final MenuMapper menuMapper;

    @PostMapping(value = "restaurants/{restaurantId}/menus", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MenuDto> createMenu(@PathVariable Long restaurantId,
                                              @RequestParam String name,
                                              @RequestParam String description,
                                              @RequestParam(required = false) MultipartFile image) throws IOException {
        Menu createdMenu = menuService.createMenu(name, description, restaurantId, image);
        MenuDto menuDto = menuMapper.toDto(createdMenu);
        return new ResponseEntity<>(menuDto, HttpStatus.CREATED);
    }

    @GetMapping("/menus/search/{id}")
    public ResponseEntity<MenuDto> getMenu(@PathVariable Long id) throws AccessDeniedException {
        Menu menu = menuService.getMenu(id);
        MenuDto menuDto = menuMapper.toDto(menu);
        return new ResponseEntity<>(menuDto, HttpStatus.OK);
    }

    @GetMapping("/restaurants/{restaurantId}/menus")
    public ResponseEntity<List<MenuDto>> getAllMenus(@PathVariable Long restaurantId) throws AccessDeniedException {
        List<Menu> menus = menuService.getAllMenus(restaurantId);
        List<MenuDto> dtos = menus.stream().map(menuMapper::toDto).toList();
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @GetMapping("/{slug}/menus/{menuId}/download-QR-code")
    public ResponseEntity<byte[]> downloadMenuQRCode(@PathVariable String slug, @PathVariable Long menuId) throws Exception {
        String menuUrl = "https://menex.my/" + slug + "/" + menuId;
        byte[] QRImage = menuService.generateMenuQRCode(menuUrl);
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename="+ slug + "-qr.png")
                .contentType(MediaType.IMAGE_PNG)
                .body(QRImage);
    }

    @GetMapping("/{slug}/menus/{menuId}/get-QR-code")
    public ResponseEntity<byte[]> getMenuQRCode(@PathVariable String slug, @PathVariable Long menuId) throws Exception {
        System.out.println("I'm here");
        String menuUrl = "https://menex.my/" + slug + "/" + menuId;
        byte[] QRImage = menuService.generateMenuQRCode(menuUrl);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(QRImage);
    }

    @PutMapping("restaurants/{restaurantId}/menus/{menuId}")
    public ResponseEntity<MenuDto> updateMenu(@PathVariable Long restaurantId,
                                              @PathVariable Long menuId,
                                              @RequestParam String name,
                                              @RequestParam String description,
                                              @RequestParam(required = false) MultipartFile image) throws IOException {
        Menu updatedMenu = menuService.updateMenu(name, description, restaurantId, menuId, image);
        MenuDto menuDto = menuMapper.toDto(updatedMenu);
        return new ResponseEntity<>(menuDto, HttpStatus.OK);
    }

    @PutMapping("/menus/{menuId}/disable")
    public ResponseEntity disableMenu(@PathVariable Long menuId){
        menuService.disableMenu(menuId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/menus/{menuId}/enable")
    public ResponseEntity enableMenu(@PathVariable Long menuId){
        menuService.enableMenu(menuId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/menus/{menuId}")
    public ResponseEntity deleteMenu(@PathVariable Long menuId) throws IOException {
        menuService.deleteMenu(menuId);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }
}
