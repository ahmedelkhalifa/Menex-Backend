package com.app.menex.security.auth;

import com.app.menex.enums.Role;
import com.app.menex.mailService.MailService;
import com.app.menex.security.config.AppUserDetails;
import com.app.menex.security.jwt.JwtService;
import com.app.menex.security.verifcationToken.VerificationToken;
import com.app.menex.security.verifcationToken.VerificationTokenRepository;
import com.app.menex.user.User;
import com.app.menex.user.UserRepository;
import com.app.menex.user.UserService;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final UserService userService;
    private final MailService mailService;
    private final VerificationTokenRepository verificationTokenRepository;
    @Value("${menex.baseURL}")
    private String baseURL;
    @Value("${jwt.expirationMs}")
    private long expirationMs;

    public ResponseEntity<LoginResponse> login(String email, String password) {
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
        ResponseCookie jwtCookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(expirationMs / 1000)
                .sameSite("None")
                .build();
        LoginResponse response = LoginResponse.builder()
                .email(userDetails.getUsername().toLowerCase())
                .role(role)
                .language(userDetails.getLanguage())
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .body(response);
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

    @Transactional
    public ResponseEntity<RegisterResponse> signup(String firstname, String lastname, String email, String password) throws MessagingException {

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists");
        }
        User user = User.builder()
                .firstName(firstname.toLowerCase())
                .lastName(lastname.toLowerCase())
                .email(email.toLowerCase())
                .password(passwordEncoder.encode(password))
                .role(Role.UNSUBSCRIBER)
                .language("en")
                .enabled(false)
                .build();
        userRepository.save(user);
        //send email
        VerificationToken verificationToken = VerificationToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .build();
        verificationTokenRepository.save(verificationToken);
        String link = baseURL + "/api/auth/verify?token=" + verificationToken.getToken();

        String fullName = user.getFirstName() + " " + user.getLastName();

        String emailContent = """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    /* Client-specific resets */
                    body, table, td, a { -webkit-text-size-adjust: 100%%; -ms-text-size-adjust: 100%%; }
                    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                    img { -ms-interpolation-mode: bicubic; }
                    
                    /* Theme Fonts */
                    body { 
                        font-family: 'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif; 
                    }
                </style>
            </head>
            <body style="margin: 0; padding: 0; background-color: #F6F8F7; width: 100%%;">
                <center>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%%" style="background-color: #F6F8F7;">
                        <tr>
                            <td align="center" style="padding: 40px 20px;">
                                
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                                    
                                    <tr>
                                        <td align="center" style="padding: 40px 40px 30px 40px; border-bottom: 1px solid #E0E5E3;">
                                            <h2 style="margin: 0; font-family: 'Inter', sans-serif; color: #6FBF73; font-weight: 700; font-size: 24px; letter-spacing: -0.5px;">
                                                MENEX
                                            </h2>
                                            <span style="font-size: 12px; color: #5F6F6F; text-transform: uppercase; letter-spacing: 2px;">Digital Menus</span>
                                        </td>
                                    </tr>
        
                                    <tr>
                                        <td style="padding: 40px; color: #2E3A3A; font-size: 16px; line-height: 1.6;">
                                            <h3 style="margin-top: 0; margin-bottom: 20px; font-weight: 600; font-size: 20px; color: #2E3A3A;">Verify your email address</h3>
                                            
                                            <p style="margin: 0 0 20px 0;">Hello <strong>%s</strong>,</p>
                                            
                                            <p style="margin: 0 0 30px 0;">
                                                Your account has been created successfully. To ensure the security of your account and access all features, please verify your email address below.
                                            </p>
        
                                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%%">
                                                <tr>
                                                    <td align="center">
                                                        <a href="%s" target="_blank" style="display: inline-block; padding: 14px 32px; background-color: #6FBF73; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 500; font-size: 16px; mso-padding-alt: 0;">
                                                            <span style="mso-text-raise: 15pt;">Verify Account</span>
                                                            </a>
                                                    </td>
                                                </tr>
                                            </table>
        
                                            <p style="margin-top: 30px; margin-bottom: 0; font-size: 14px; color: #5F6F6F;">
                                                If the button doesn't work, verify using this link:<br>
                                                <a href="%s" style="color: #6FBF73; text-decoration: none; word-break: break-all;">%s</a>
                                            </p>
                                            <p style="margin-top: 30px; margin-bottom: 0; font-size: 14px; color: #5F6F6F;">
                                                <b>Please note that if you didn't verify your account within 48 hours the account will be deleted</b>
                                            </p>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 0 40px 30px 40px; text-align: center; color: #5F6F6F; font-size: 13px;">
                                            <p style="margin: 0;">&copy; 2026 MENEX Digital Menus. All rights reserved.</p>
                                        </td>
                                    </tr>
        
                                </table>
                            </td>
                        </tr>
                    </table>
                </center>
            </body>
            </html>
            """.formatted(fullName, link, link, "Click Here");
        mailService.sendHtmlMail(user.getEmail(),"Verify your email", emailContent);

        //create token and assign it
        String token = jwtService.generateToken(user.getEmail());
        ResponseCookie jwtCookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(expirationMs / 1000)
                .sameSite("None")
                .build();
        RegisterResponse response = RegisterResponse.builder()
                .firstname(user.getFirstName())
                .lastname(user.getLastName())
                .email(user.getEmail())
                .id(user.getId())
                .role(Role.UNSUBSCRIBER)
                .createdAt(user.getCreatedAt())
                .language(user.getLanguage())
                .build();
        return ResponseEntity.status(HttpStatus.CREATED)
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .body(response);
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


    @Transactional
    public void resendToken(String email) throws MessagingException {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return;
        }
        User user =  userOptional.get();
        verificationTokenRepository.deleteByUser(user);
        verificationTokenRepository.flush();

        //new token
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = VerificationToken.builder()
                .token(token)
                .user(user)
                .build();
        verificationTokenRepository.save(verificationToken);
        String link = baseURL + "/api/auth/verify?token=" + verificationToken.getToken();

        String fullName = user.getFirstName() + " " + user.getLastName();

        String emailContent = """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    /* Client-specific resets */
                    body, table, td, a { -webkit-text-size-adjust: 100%%; -ms-text-size-adjust: 100%%; }
                    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                    img { -ms-interpolation-mode: bicubic; }
                    
                    /* Theme Fonts */
                    body { 
                        font-family: 'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif; 
                    }
                </style>
            </head>
            <body style="margin: 0; padding: 0; background-color: #F6F8F7; width: 100%%;">
                <center>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%%" style="background-color: #F6F8F7;">
                        <tr>
                            <td align="center" style="padding: 40px 20px;">
                                
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                                    
                                    <tr>
                                        <td align="center" style="padding: 40px 40px 30px 40px; border-bottom: 1px solid #E0E5E3;">
                                            <h2 style="margin: 0; font-family: 'Inter', sans-serif; color: #6FBF73; font-weight: 700; font-size: 24px; letter-spacing: -0.5px;">
                                                MENEX
                                            </h2>
                                            <span style="font-size: 12px; color: #5F6F6F; text-transform: uppercase; letter-spacing: 2px;">Digital Menus</span>
                                        </td>
                                    </tr>
        
                                    <tr>
                                        <td style="padding: 40px; color: #2E3A3A; font-size: 16px; line-height: 1.6;">
                                            <h3 style="margin-top: 0; margin-bottom: 20px; font-weight: 600; font-size: 20px; color: #2E3A3A;">Verify your email address</h3>
                                            
                                            <p style="margin: 0 0 20px 0;">Hello <strong>%s</strong>,</p>
                                            
                                            <p style="margin: 0 0 30px 0;">
                                                Your account has been created successfully. To ensure the security of your account and access all features, please verify your email address below.
                                            </p>
        
                                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%%">
                                                <tr>
                                                    <td align="center">
                                                        <a href="%s" target="_blank" style="display: inline-block; padding: 14px 32px; background-color: #6FBF73; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 500; font-size: 16px; mso-padding-alt: 0;">
                                                            <span style="mso-text-raise: 15pt;">Verify Account</span>
                                                            </a>
                                                    </td>
                                                </tr>
                                            </table>
        
                                            <p style="margin-top: 30px; margin-bottom: 0; font-size: 14px; color: #5F6F6F;">
                                                If the button doesn't work, verify using this link:<br>
                                                <a href="%s" style="color: #6FBF73; text-decoration: none; word-break: break-all;">%s</a>
                                            </p>
                                            <p style="margin-top: 30px; margin-bottom: 0; font-size: 14px; color: #5F6F6F;">
                                                <b>Please note that if you didn't verify your account within 48 hours the account will be deleted</b>
                                            </p>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 0 40px 30px 40px; text-align: center; color: #5F6F6F; font-size: 13px;">
                                            <p style="margin: 0;">&copy; 2026 MENEX Digital Menus. All rights reserved.</p>
                                        </td>
                                    </tr>
        
                                </table>
                            </td>
                        </tr>
                    </table>
                </center>
            </body>
            </html>
            """.formatted(fullName, link, link, "Click Here");
        mailService.sendHtmlMail(user.getEmail(),"Verify your email", emailContent);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        VerificationToken token = verificationTokenRepository.findByToken(request.getToken());
        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
        verificationTokenRepository.delete(token);
    }
}
