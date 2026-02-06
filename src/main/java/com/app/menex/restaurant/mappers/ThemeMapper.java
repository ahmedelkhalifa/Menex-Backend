package com.app.menex.restaurant.mappers;

import com.app.menex.restaurant.dtos.ThemeDto;
import com.app.menex.theme.Theme;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ThemeMapper {

    @Mapping(source = "textPrimary", target = "textPrimary")
    @Mapping(source = "textSecondary", target = "textSecondary")
    @Mapping(source = "background", target = "background")
    @Mapping(source = "backgroundCard", target = "backgroundCard")
    ThemeDto toDto(Theme theme);
}
