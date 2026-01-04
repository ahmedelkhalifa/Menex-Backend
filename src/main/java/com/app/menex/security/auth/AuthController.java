package com.app.menex.security.auth;

import com.app.menex.user.User;
import com.app.menex.user.dtos.UserDto;
import com.app.menex.user.mappers.UserMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserMapper userMapper;

   @PostMapping("/login")
   public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request.getEmail(), request.getPassword());
        return new ResponseEntity<>(response, HttpStatus.OK);
   }

   @PostMapping("/register")
   @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<UserDto> register(@Valid @RequestBody RegisterRequest request) {
        User createdUser = authService.register(
                request.getFirstname(),
                request.getLastname(),
                request.getEmail(),
                request.getPassword(),
                request.getRole());
        return new ResponseEntity<>(userMapper.toDto(createdUser), HttpStatus.CREATED);
   }

   @GetMapping("/validate")
   public String  validate() {
       return "valid";
   }
}
