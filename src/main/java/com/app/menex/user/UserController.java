package com.app.menex.user;

import com.app.menex.security.verifcationToken.VerificationToken;
import com.app.menex.security.verifcationToken.VerificationTokenRepository;
import com.app.menex.user.dtos.UpdateUserRequest;
import com.app.menex.user.dtos.UserDto;
import com.app.menex.user.mappers.UserMapper;
import com.stripe.exception.StripeException;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.http.HttpResponse;
import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;
    @Value("${menex.frontendURL}")
    private String frontendURL;
    private final VerificationTokenRepository verificationTokenRepository;

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserDto>  userDtos = users.stream().map(userMapper::toDto).toList();
        return new ResponseEntity<>(userDtos, HttpStatus.OK);
    }

    @GetMapping("/users/profile")
    public ResponseEntity<UserDto> getUserProfile() {
        User user = userService.getCurrentUser();
        UserDto userDto = userMapper.toDto(user);
        return new ResponseEntity<>(userDto, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("users/owners")
    public ResponseEntity<List<UserDto>> getAllRestaurantOwners() {
        List<User> users = userService.getAllRestaurantOwners();
        List<UserDto>  userDtos = users.stream().map(userMapper::toDto).toList();
        return  new ResponseEntity<>(userDtos, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("users/unsubscribers")
    public ResponseEntity<List<UserDto>> getAllUnsubscribers() {
        List<User> users = userService.getAllUnsubscribedUsers();
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

    @PutMapping("/users/{userId}/updateLanguage")
    public ResponseEntity updateLanguage(@PathVariable Long userId, @RequestParam String language) throws AccessDeniedException {
        userService.updateLanguage(userId, language);
        return new ResponseEntity(HttpStatus.OK);
    }

    @PutMapping("/reset-password")
    public void forgotPassword(@RequestBody Map<String, String> request) throws IOException, MessagingException {
        userService.forgotPassword(request.get("email"));
    }

    @GetMapping("verify-password-token")
    public void verifyToken(HttpServletResponse response, @RequestParam String token) throws IOException {
        System.out.println(token);
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token);
        if (verificationToken == null) {
            throw new BadRequestException("Invalid token");
        }

        if (verificationToken.isExpired()) {
            throw new BadRequestException("token is expired");
        }
        response.sendRedirect(frontendURL + "/reset-password?token=" + verificationToken.getToken());
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity deleteUser(@PathVariable Long userId) throws IOException, StripeException {
        userService.deleteUser(userId);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }
}
