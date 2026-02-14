package com.app.menex.security.auth;

import com.app.menex.security.verifcationToken.VerificationToken;
import com.app.menex.security.verifcationToken.VerificationTokenRepository;
import com.app.menex.user.User;
import com.app.menex.user.UserRepository;
import com.app.menex.user.dtos.UserDto;
import com.app.menex.user.mappers.UserMapper;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URI;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserMapper userMapper;
    private final VerificationTokenRepository verificationTokenRepository;
    private final UserRepository userRepository;
    @Value("${menex.frontendURL}")
    private String frontendURL;

   @PostMapping("/login")
   public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request.getEmail(), request.getPassword());
        return new ResponseEntity<>(response, HttpStatus.OK);
   }

    @GetMapping("/verify")
    public void verifyAccount(@RequestParam String token, HttpServletResponse response) throws IOException {
        String successUrl = frontendURL + "/verification";
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token);
        if (verificationToken == null) {
            response.sendRedirect(successUrl + "?error=invalid");
            return;
        }

        if (verificationToken.isExpired()) {
            response.sendRedirect(successUrl + "?error=expired");
            return;
        }

        User user = verificationToken.getUser();
        user.setEnabled(true);
        userRepository.save(user);
        verificationTokenRepository.delete(verificationToken);
        response.sendRedirect(successUrl + "?verified=true");
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

   @PostMapping("/signup")
   public ResponseEntity<RegisterResponse> signup(@Valid @RequestBody RegisterRequest request) throws MessagingException {
       RegisterResponse response = authService.signup(request.getFirstname(), request.getLastname(),
               request.getEmail(), request.getPassword());
       return new ResponseEntity<>(response, HttpStatus.CREATED);
   }

   @PostMapping("/resend-email")
   public ResponseEntity<?> resendVerificationToken(@RequestBody Map<String, String> request) throws MessagingException {
       String email = request.get("email");
       if (email == null || email.isEmpty()) {
           return new ResponseEntity<>("Email is required", HttpStatus.BAD_REQUEST);
       }
       authService.resendToken(email);
       return new ResponseEntity<>("verification link sent", HttpStatus.OK);
   }

   @PreAuthorize("hasRole('SUPER_ADMIN')")
   @PutMapping("/disable/{userId}")
   public ResponseEntity disable(@PathVariable Long userId) {
       authService.disableUser(userId);
       return  new ResponseEntity<>(HttpStatus.OK);
   }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PutMapping("/enable/{userId}")
    public ResponseEntity enable(@PathVariable Long userId) {
        authService.enableUser(userId);
        return  new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/change-password")
    public ResponseEntity changePassword(@Valid @RequestBody ChangePasswordRequest request) {
       authService.changePassword(request.getOldPassword(), request.getNewPassword());
       return  new ResponseEntity<>(HttpStatus.OK);
    }

   @GetMapping("/validate")
   public String  validate() {
       return "valid";
   }
}
