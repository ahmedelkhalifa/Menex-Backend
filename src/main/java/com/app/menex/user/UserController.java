package com.app.menex.user;

import com.app.menex.user.dtos.UpdateUserRequest;
import com.app.menex.user.dtos.UserDto;
import com.app.menex.user.mappers.UserMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserDto>  userDtos = users.stream().map(userMapper::toDto).toList();
        return new ResponseEntity<>(userDtos, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("users/owners")
    public ResponseEntity<List<UserDto>> getAllRestaurantOwners() {
        List<User> users = userService.getAllRestaurantOwners();
        List<UserDto>  userDtos = users.stream().map(userMapper::toDto).toList();
        return  new ResponseEntity<>(userDtos, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("users/admins")
    public ResponseEntity<List<UserDto>> getAllAdmins() {
        List<User> users = userService.getAllAdmins();
        List<UserDto>  userDtos = users.stream().map(userMapper::toDto).toList();
        return  new ResponseEntity<>(userDtos, HttpStatus.OK);
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long userId, @Valid @RequestBody UpdateUserRequest request)
            throws AccessDeniedException {
        User updatedUser = userService.updateUser(userId, request.getFirstname(),
                request.getLastname(), request.getEmail(), request.getRole());
        return ResponseEntity.ok(userMapper.toDto(updatedUser));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity deleteUser(@PathVariable Long userId) throws AccessDeniedException {
        userService.deleteUser(userId);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }
}
