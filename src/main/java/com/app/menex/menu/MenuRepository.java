package com.app.menex.menu;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {

    Optional<Menu> findByIdAndRestaurantOwnerId(Long id, Long ownerId);

    @EntityGraph(attributePaths = {"categories", "restaurant"})
    List<Menu> findAllByRestaurantIdOrderByIdAsc(Long restaurantId);

    boolean existsByIdAndRestaurantOwnerId(Long menuId, Long id);

    List<Menu> findAllByRestaurantOwnerId(Long id);

    Optional<Menu> findByIdAndRestaurantSlug(Long menuId, String restaurantSlug);

    long countByRestaurantOwnerId(Long id);
}
