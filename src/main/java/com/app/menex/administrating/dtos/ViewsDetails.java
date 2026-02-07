package com.app.menex.administrating.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ViewsDetails {
    private Integer totalViews;
    private Integer restaurantViews;
    private Integer menusViews;
}
