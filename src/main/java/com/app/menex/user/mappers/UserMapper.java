package com.app.menex.user.mappers;

import com.app.menex.user.User;
import com.app.menex.user.dtos.UserDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    @Mapping(source = "enabled", target = "enabled")
    UserDto toDto(User user);
}
