package com.app.menex.category;

import com.app.menex.menu.Menu;
import com.app.menex.menu.MenuRepository;
import com.app.menex.user.User;
import com.app.menex.user.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final MenuRepository menuRepository;
    private final UserService userService;

    @Transactional
    public Category createCategory(Long menuId, String categoryName) {
        User user = userService.getCurrentUser();
        Menu menu = menuRepository.findByIdAndRestaurantOwnerId(menuId, user.getId()).orElseThrow(
                () -> new EntityNotFoundException("Menu with id " + menuId + " not found")
        );
        Category category = Category.builder()
                .name(categoryName.toLowerCase())
                .build();
        menu.addCategory(category);
        categoryRepository.saveAndFlush(category);
        return category;
    }

    @Transactional(readOnly = true)
    public List<Category> getAllCategories(Long menuId) {
        User user = userService.getCurrentUser();
        if (!menuRepository.existsByIdAndRestaurantOwnerId(menuId, user.getId())) {
            throw new EntityNotFoundException("Menu with id " + menuId + " not found");
        }
        return categoryRepository.findAllByMenuId(menuId);
    }

    @Transactional(readOnly = true)
    public Category getCategory(Long categoryId) {
        User user = userService.getCurrentUser();
        return categoryRepository.findByIdAndOwnerId(categoryId, user.getId()).orElseThrow(
                () -> new EntityNotFoundException("Category with id " + categoryId + " not found")
        );
    }

    @Transactional
    public Category updateCategory(Long categoryId, Long newMenuId, String categoryName) {
        User user =  userService.getCurrentUser();
        Category category = categoryRepository.findByIdAndOwnerId(categoryId, user.getId()).orElseThrow(
                () -> new EntityNotFoundException("Category with id " + categoryId + " not found")
        );
        category.setName(categoryName);
        Menu oldMenu = category.getMenu();
        Menu newMenu =  menuRepository.findByIdAndRestaurantOwnerId(newMenuId, user.getId()).orElseThrow(
                () -> new EntityNotFoundException("Menu with id " + newMenuId + " not found")
        );
        if (!oldMenu.getId().equals(newMenu.getId())) {
            oldMenu.removeCategory(category);
            newMenu.addCategory(category);
        }
        return category;
    }

    @Transactional
    public void deleteCategory(Long categoryId) {
        User user = userService.getCurrentUser();
        categoryRepository.deleteByIdAndOwnerId(categoryId, user.getId());
    }
}
