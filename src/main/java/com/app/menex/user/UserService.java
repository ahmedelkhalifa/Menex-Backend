package com.app.menex.user;

import com.app.menex.enums.Role;
import com.app.menex.security.config.AppUserDetails;
import com.app.menex.security.verifcationToken.VerificationTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final VerificationTokenRepository verificationTokenRepository;

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
    public void deleteUser(Long userId) throws AccessDeniedException {
        User current = getCurrentUser();
        List<User> admins = userRepository.findAllByRole(Role.SUPER_ADMIN);
        List<Long> adminIds = admins.stream().map(User::getId).toList();
        if (adminIds.contains(current.getId()) || current.getId().equals(userId)) {
            if (userId.equals(current.getId())) {
                throw new IllegalArgumentException("You can't delete yourself");
            }
            verificationTokenRepository.deleteByUser(userRepository.findById(userId).get());
            userRepository.deleteById(userId);
        } else {
            throw new AccessDeniedException("You don't have access to perform this operation");
        }
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
}
