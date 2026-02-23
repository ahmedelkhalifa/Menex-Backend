package com.app.menex.user;

import com.app.menex.enums.Role;
import com.app.menex.mailService.MailService;
import com.app.menex.payment.repository.UserSubscriptionRespository;
import com.app.menex.restaurant.Restaurant;
import com.app.menex.security.config.AppUserDetails;
import com.app.menex.security.verifcationToken.VerificationToken;
import com.app.menex.security.verifcationToken.VerificationTokenRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.Subscription;
import com.stripe.model.SubscriptionCollection;
import com.stripe.param.SubscriptionListParams;
import com.stripe.param.SubscriptionUpdateParams;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final UserSubscriptionRespository userSubscriptionRespository;
    @Value("${app.upload.dir}")
    private String uploadDir;
    private final MailService mailService;

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(
                () -> new UsernameNotFoundException("User not found with email: " + email)
        );
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AppUserDetails userDetails = (AppUserDetails) authentication.getPrincipal();
        return userDetails.getUser();
    }

    public User findById(Long id) {
        return userRepository.findById(id).orElseThrow(
                () -> new UsernameNotFoundException("User not found with id: " + id));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getAllRestaurantOwners() {
        return userRepository.findAllByRole(Role.RESTAURANT_OWNER);
    }

    public List<User> getAllUnsubscribedUsers() {
        return userRepository.findAllByRole(Role.UNSUBSCRIBER);
    }

    @Transactional
    public User updateUser(Long userId, String firstname, String lastname, String email, Role role) throws AccessDeniedException {
        User current = getCurrentUser();
        List<User> admins = userRepository.findAllByRole(Role.SUPER_ADMIN);
        List<Long> adminIds = admins.stream().map(User::getId).toList();
        User user = userRepository.findById(userId).orElseThrow(
                () -> new UsernameNotFoundException("User not found with id: " + userId)
        );
        if (current.getId().equals(user.getId()) || adminIds.contains(current.getId())) {
            if (firstname != null) {
                user.setFirstName(firstname);
            }
            if (lastname != null) {
                user.setLastName(lastname);
            }
            if (email != null) {
                user.setEmail(email);
            }
            if (role != null) {
                user.setRole(role);
            }
        } else {
            throw new AccessDeniedException("Access denied");
        }
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long userId) throws IOException, StripeException {
        User currentUser = getCurrentUser();

        boolean isAdmin = currentUser.getRole().equals(Role.SUPER_ADMIN);

        if (!isAdmin) {
            throw new AccessDeniedException("Only Admins can delete users.");
        }

        if (currentUser.getId().equals(userId)) {
            throw new IllegalArgumentException("You cannot delete your own account.");
        }

        User userToDelete = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        verificationTokenRepository.deleteByUser(userToDelete);
        userSubscriptionRespository.deleteByUser(userToDelete);

        Set<Restaurant> restaurants = userToDelete.getRestaurants();
        for (Restaurant restaurant : restaurants) {
            Path path = Paths.get(uploadDir, restaurant.getId().toString());
            deleteDir(path);
        }

        userRepository.delete(userToDelete);
    }

    private void deleteDir(Path path) throws IOException {
        if (Files.notExists(path)) return;
        Files.walk(path)
                .sorted(Comparator.reverseOrder())
                .forEach(p -> {
                    try {
                        Files.delete(p);
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    public List<User> getAllAdmins() {
        return  userRepository.findAllByRole(Role.SUPER_ADMIN);
    }

    public void updateLanguage(long userId, String language) throws AccessDeniedException {
        User user = getCurrentUser();
        if (user.getId().equals(userId)) {
            user.setLanguage(language);
            userRepository.save(user);
        } else  {
            throw new AccessDeniedException("You don't have access");
        }
    }

    @Transactional
    public void forgotPassword(String email) throws MessagingException {
        User current =  userRepository.findByEmail(email).orElseThrow(
                () -> new UsernameNotFoundException("User not found with email: " + email)
        );
        String token = UUID.randomUUID().toString();
        VerificationToken vt = VerificationToken.builder()
                .token(token)
                .user(current)
                .expiration(LocalDateTime.now().plusDays(1))
                .build();
        mailService.sendResetPasswordEmail(current.getEmail(), current.getFirstName(), token);
        verificationTokenRepository.save(vt);
    }
}
