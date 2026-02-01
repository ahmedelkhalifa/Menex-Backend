package com.app.menex.menuItem;

import com.app.menex.category.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem,Long> {
    List<MenuItem> findAllByCategoryMenuRestaurantOwnerId(Long id);

    Optional<MenuItem> findByIdAndCategoryMenuRestaurantOwnerId(Long itemId, Long id);

    List<MenuItem> findAllByCategoryOrderByIdAsc(Category category);
}
