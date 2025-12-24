package com.app.menex.category;

import com.app.menex.menu.Menu;
import com.app.menex.menuItem.MenuItem;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "categories")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private Integer position;

    @ManyToOne
    @JoinColumn(name = "menu_id", nullable = false)
    private Menu menu;

    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY,
    cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position ASC")
    private List<MenuItem>  menuItems = new ArrayList<>();

    public void addMenuItem(MenuItem menuItem) {
        menuItems.add(menuItem);
        menuItem.setCategory(this);
    }
    public void removeMenuItem(MenuItem menuItem) {
        menuItems.remove(menuItem);
        menuItem.setCategory(null);
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Category category = (Category) o;
        return Objects.equals(id, category.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
