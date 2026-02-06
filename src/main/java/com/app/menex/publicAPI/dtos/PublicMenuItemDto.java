package com.app.menex.publicAPI.dtos;

import com.app.menex.category.dtos.CategoryDto;
import com.app.menex.menuItem.Currency;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PublicMenuItemDto {
    Long id;
    String name;
    String description;
    BigDecimal price;
    String imageUrl;
    boolean available;
    Currency currency;
}
