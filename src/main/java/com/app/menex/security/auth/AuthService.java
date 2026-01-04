package com.app.menex.security.auth;

import com.app.menex.enums.Role;
import com.app.menex.security.config.AppUserDetails;
import com.app.menex.security.jwt.JwtService;
import com.app.menex.user.User;
import com.app.menex.user.UserRepository;
import com.app.menex.user.dtos.UserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public LoginResponse login(String email, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email.toLowerCase(), password)
        );
        AppUserDetails userDetails = (AppUserDetails) authentication.getPrincipal();
        String token = jwtService.generateToken(userDetails.getUsername());
        Role role = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(a -> a.replace("ROLE_", ""))
                .map(Role::valueOf)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid role"));
        LoginResponse response = LoginResponse.builder()
                .token(token)
                .email(userDetails.getUsername().toLowerCase())
                .role(role)
                .build();
        return response;
    }

    public User register(String firstname, String lastname, String email, String password, Role role) {
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = User.builder()
                    .firstName(firstname.toLowerCase())
                    .lastName(lastname.toLowerCase())
                    .email(email.toLowerCase())
                    .password(passwordEncoder.encode(password))
                    .role(role)
                    .build();
            return userRepository.save(newUser);
        });
        return user;
    }
}
