package com.app.menex.category;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    @EntityGraph(attributePaths = {"menu"})
    List<Category> findAllByMenuId(Long menuId);

    @Query("""
            select c from Category c
            left join fetch c.menu m
            where c.id = :categoryId and m.restaurant.owner.id = :ownerId
            """)
    Optional<Category> findByIdAndOwnerId(@Param("categoryId") Long categoryId, @Param("ownerId") Long ownerId);

    @Modifying
    @Query("""
            delete from Category c
            where c.id = :categoryId and c.menu.restaurant.owner.id = :ownerId
            """)
    void deleteByIdAndOwnerId(@Param("categoryId") Long categoryId, @Param("ownerId") Long ownerId);

    List<Category> findAllByMenuRestaurantOwnerId(Long id);
}
