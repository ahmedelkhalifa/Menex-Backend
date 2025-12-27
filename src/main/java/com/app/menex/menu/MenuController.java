package com.app.menex.menu;

import com.app.menex.menu.dtos.CreateMenuRequest;
import com.app.menex.menu.dtos.MenuDto;
import com.app.menex.menu.dtos.UpdateMenuRequest;
import com.app.menex.menu.mappers.MenuMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;
    private final MenuMapper menuMapper;

    @PostMapping
    public ResponseEntity<MenuDto> createMenu(@RequestBody CreateMenuRequest request) throws AccessDeniedException {
        Menu createdMenu = menuService.createMenu(request.getMenuName(), request.getRestaurantId());
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
    public ResponseEntity<Set<MenuDto>> getAllMenus(@PathVariable Long restaurantId) throws AccessDeniedException {
        Set<Menu> menus = menuService.getAllMenus(restaurantId);
        Set<MenuDto> dtos = menus.stream().map(menuMapper::toDto).collect(Collectors.toSet());
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @PutMapping("/menus/{menuId}")
    public ResponseEntity<MenuDto> updateMenu(@Valid @RequestBody UpdateMenuRequest request,
                                              @PathVariable Long menuId){
        Menu updatedMenu = menuService.updateMenu(request.getMenuName(), request.getRestaurantId(), menuId);
        MenuDto menuDto = menuMapper.toDto(updatedMenu);
        return new ResponseEntity<>(menuDto, HttpStatus.OK);
    }

    @DeleteMapping("/menus/{menuId}")
    public ResponseEntity deleteMenu(@PathVariable Long menuId){
        menuService.deleteMenu(menuId);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }
}
