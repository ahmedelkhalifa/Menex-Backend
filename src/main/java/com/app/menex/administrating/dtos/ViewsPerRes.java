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
public class ViewsPerRes {
    private HashMap<String, Integer> perMenuViews;
    private Integer totalViews;
    private Integer restaurantViews;
}
