package com.app.menex.security.auth;

import com.app.menex.enums.Role;
import com.app.menex.security.config.AppUserDetails;
import com.app.menex.security.jwt.JwtService;
import com.app.menex.user.User;
import com.app.menex.user.UserRepository;
import com.app.menex.user.UserService;
import com.app.menex.user.dtos.UserDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final UserService userService;

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
                    .language("en")
                    .enabled(true)
                    .build();
            return userRepository.save(newUser);
        });
        return user;
    }

    public void disableUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new UsernameNotFoundException("User with id " + userId + " not found")
        );
        user.setEnabled(false);
        userRepository.save(user);
    }
    public void enableUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new UsernameNotFoundException("User with id " + userId + " not found")
        );
        user.setEnabled(true);
        userRepository.save(user);
    }

    @Transactional
    public void changePassword(String oldPassword, String newPassword) {
        User user = userService.getCurrentUser();
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new BadCredentialsException("Invalid old password");
        }
        if (newPassword.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters");
        }

        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new IllegalArgumentException("New password must be different");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
