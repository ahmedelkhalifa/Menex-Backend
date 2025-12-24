package com.app.menex.menuItem;

import com.app.menex.category.Category;
import com.app.menex.menu.Menu;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.Objects;

@Entity
@Table(name = "menu_items")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
    @Column(length = 500)
    private String description;
    @Column(nullable = false)
    private BigDecimal price;

    private String imageUrl;
    private boolean available;
    private Integer position;

    @ManyToOne
    @JoinColumn(nullable = false, name = "category_id")
    private Category category;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        MenuItem menuItem = (MenuItem) o;
        return Objects.equals(id, menuItem.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
