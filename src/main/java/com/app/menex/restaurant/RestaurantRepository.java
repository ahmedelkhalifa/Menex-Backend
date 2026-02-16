package com.app.menex.restaurant;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    boolean existsBySlug(String slug);
    Restaurant findBySlug(String slug);

    @EntityGraph(attributePaths = {"menus"})
    List<Restaurant> findAllByOwnerIdOrderByIdAsc(Long id);

    Optional<Restaurant> findByIdAndOwnerId(Long restaurantId, Long ownerId);

    long countByOwnerId(Long id);
}
