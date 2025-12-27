package com.app.menex.category;

import com.app.menex.category.dtos.CategoryDto;
import com.app.menex.category.dtos.CreateCategoryRequest;
import com.app.menex.category.mappers.CategoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final CategoryMapper categoryMapper;

    @PostMapping("/menus/{menuId}/categories")
    public ResponseEntity<CategoryDto> createCategory(@PathVariable Long menuId,
                                                      @RequestBody CreateCategoryRequest request) {
        Category createdCategory = categoryService.createCategory(menuId, request.getCategoryName());
        CategoryDto createdCategoryDto = categoryMapper.toDto(createdCategory);
        return new ResponseEntity<>(createdCategoryDto, HttpStatus.CREATED);
    }

    @GetMapping("/menus/{menuId}/categories")
    public ResponseEntity<List<CategoryDto>> getCategories(@PathVariable Long menuId) {
        List<Category> categories = categoryService.getAllCategories(menuId);
        List<CategoryDto> dtos = categories.stream().map(categoryMapper::toDto).toList();
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @GetMapping("/menus/categories/{categoryId}")
    public ResponseEntity<CategoryDto> getCategory(@PathVariable Long categoryId) {
        Category category = categoryService.getCategory(categoryId);
        CategoryDto dto = categoryMapper.toDto(category);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @PutMapping("/menus/{newMenuId}/categories/{categoryId}")
    public ResponseEntity<CategoryDto> updateCategory(@PathVariable Long categoryId,
                                                      @PathVariable Long newMenuId,
                                                      @RequestBody CreateCategoryRequest request) {
        Category updatedCategory = categoryService.updateCategory(categoryId, newMenuId, request.getCategoryName());
        CategoryDto dto  = categoryMapper.toDto(updatedCategory);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @DeleteMapping("/menus/categories/{categoryId}")
    public ResponseEntity deleteCategory(@PathVariable Long categoryId) {
        categoryService.deleteCategory(categoryId);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }
}
