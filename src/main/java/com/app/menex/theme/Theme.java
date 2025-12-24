package com.app.menex.theme;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "themes")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Theme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String primaryColor;
    private String secondaryColor;
    private String font;
}
