package com.app.menex.restaurant;

import com.app.menex.menu.Menu;
import com.app.menex.theme.Theme;
import com.app.menex.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "restaurants")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false,  unique = true)
    private String slug;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @OneToMany(mappedBy = "restaurant", fetch = FetchType.LAZY,
    cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Menu> menus = new HashSet<>();

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "theme_id")
    private Theme theme;

    public void addMenu(Menu menu) {
        menus.add(menu);
        menu.setRestaurant(this);
    }
    public void removeMenu(Menu menu) {
        menus.remove(menu);
        menu.setRestaurant(null);
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Restaurant that = (Restaurant) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
