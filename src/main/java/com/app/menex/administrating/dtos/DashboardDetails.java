package com.app.menex.administrating.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DashboardDetails {
    int usersCount;
    int restaurantsCount;
    int menusCount;
    int categoriesCount;
    int menuItemsCount;
    int adminsCount;
}
