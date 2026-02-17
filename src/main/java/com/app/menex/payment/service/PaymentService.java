package com.app.menex.payment.service;

import com.app.menex.enums.Role;
import com.app.menex.mailService.MailService;
import com.app.menex.payment.model.SubscribeRequest;
import com.app.menex.payment.model.SubscriptionDetails;
import com.app.menex.payment.model.SubscriptionStatus;
import com.app.menex.payment.model.UserSubscription;
import com.app.menex.payment.repository.UserSubscriptionRespository;
import com.app.menex.user.User;
import com.app.menex.user.UserRepository;
import jakarta.annotation.PostConstruct;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final UserSubscriptionRespository repository;
    private final UserRepository userRepository;
    private final MailService mailService;
    private final PasswordEncoder passwordEncoder;
    private static final BigDecimal PRICE_MONTHLY = new BigDecimal("7.00");
    private static final BigDecimal PRICE_YEARLY = new BigDecimal("70.00");
    private static final String intervalMonth = "month";
    private static final String intervalYear = "year";

    @Transactional
    public void subscribe(SubscribeRequest request) {
        User user = userRepository.findById(request.getUserId()).orElseThrow(
                () -> new EntityNotFoundException("no user was found")
        );
        LocalDateTime now = LocalDateTime.now();
        UserSubscription userSubscription = UserSubscription.builder()
                .user(user)
                .startDate(now)
                .endDate(now.plusDays(request.getDays()))
                .status(SubscriptionStatus.ACTIVE)
                .amount(request.getDays() == 30 ? PRICE_MONTHLY : PRICE_YEARLY)
                .interval(request.getDays() == 30 ? intervalMonth : intervalYear)
                .build();
        user.setRole(Role.RESTAURANT_OWNER);
        repository.save(userSubscription);
        userRepository.save(user);
        try {
            boolean isYearly = request.getDays() == 365;
            String planName = isYearly ? "Annual" : "Monthly";

            mailService.sendSubscriptionActivated(
                    user.getEmail(),
                    user.getFirstName(),
                    planName,
                    userSubscription.getEndDate()
            );
        } catch (MessagingException e) {
            System.err.println("Failed to send activation email: " + e.getMessage());
        }
    }

    @Transactional
    public void unsubscribe(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new EntityNotFoundException("no user was found")
        );
        UserSubscription userSubscription = repository.findTopByUserIdAndStatusOrderByEndDateDesc(userId,
                SubscriptionStatus.ACTIVE).orElseThrow(
                () -> new EntityNotFoundException("No subscription found")
        );
        userSubscription.setEndDate(LocalDateTime.now());
        userSubscription.setStatus(SubscriptionStatus.CANCELLED);
        repository.save(userSubscription);
        user.setRole(Role.UNSUBSCRIBER);
        // --- NEW: SEND EMAIL ---
        try {
            mailService.sendCancellationConfirmation(
                    user.getEmail(),
                    user.getFirstName(),
                    userSubscription.getEndDate()
            );
        } catch (MessagingException e) {
            System.err.println("Failed to send cancellation email: " + e.getMessage());
        }
    }

    public SubscriptionDetails getSubscriptionDetails(Long userId) {
        UserSubscription subscription = repository.findTopByUserIdAndStatusOrderByEndDateDesc(userId,
                SubscriptionStatus.ACTIVE).orElseThrow(
                        () -> new EntityNotFoundException("No subscription found")
        );
        return SubscriptionDetails.builder()
                .subscriptionStart(subscription.getStartDate().toEpochSecond(ZoneOffset.UTC))
                .currentPeriodEnd(subscription.getEndDate().toEpochSecond(ZoneOffset.UTC))
                .amount(subscription.getAmount())
                .status(subscription.getStatus())
                .interval(subscription.getInterval())
                .build();
    }

    public SubscriptionDetails getSubscriptionDetailsAdmin(Long userId) {
        UserSubscription subscription = repository.findTopByUserIdOrderByEndDateDesc(userId).orElseThrow(
                () -> new EntityNotFoundException("No subscription found")
        );
        return SubscriptionDetails.builder()
                .subscriptionStart(subscription.getStartDate().toEpochSecond(ZoneOffset.UTC))
                .currentPeriodEnd(subscription.getEndDate().toEpochSecond(ZoneOffset.UTC))
                .amount(subscription.getAmount())
                .status(subscription.getStatus())
                .interval(subscription.getInterval())
                .build();
    }

    @Transactional
    public void renewSubscription(SubscribeRequest request) {
        UserSubscription subscription = repository.findTopByUserIdOrderByEndDateDesc(request.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("No subscription found to renew. Use 'Activate' for new users."));

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime currentEnd = subscription.getEndDate();
        LocalDateTime newEnd;

        if (currentEnd.isBefore(now)) {
            newEnd = now.plusDays(request.getDays());
            subscription.setStartDate(now);
        } else {
            newEnd = currentEnd.plusDays(request.getDays());
        }
        subscription.setStartDate(now);
        subscription.setEndDate(newEnd);
        subscription.setStatus(SubscriptionStatus.ACTIVE);
        subscription.setInterval(request.getDays() > 30 ? intervalYear : intervalMonth);
        subscription.setAmount(request.getDays() > 30 ? PRICE_YEARLY : PRICE_MONTHLY);
        repository.save(subscription);
        User user = subscription.getUser();
        user.setRole(Role.RESTAURANT_OWNER);
        userRepository.save(user);
        try {
            mailService.sendRenewalConfirmation(
                    user.getEmail(),
                    user.getFirstName(),
                    subscription.getEndDate()
            );
        } catch (MessagingException e) {
            System.err.println("Failed to send renewal email: " + e.getMessage());
        }
    }

    @Scheduled(cron = "0 0 0 * * ?") // Runs at midnight
    @Transactional // Keeps the session open for updates
    public void checkRoles() {
        LocalDateTime now = LocalDateTime.now();

        // --- JOB 1: Deactivate Expired Users ---
        List<UserSubscription> expiredList = repository.findExpiredSubscriptions(SubscriptionStatus.ACTIVE, now);

        for (UserSubscription sub : expiredList) {
            sub.setStatus(SubscriptionStatus.CANCELLED);
            User user = sub.getUser();
            user.setRole(Role.UNSUBSCRIBER);
            System.out.println("user expired");
            try {
                mailService.sendSubscriptionExpired(
                        sub.getUser().getEmail(),
                        sub.getUser().getFirstName(),
                        sub.getEndDate()
                );
            } catch (Exception e) {
                System.err.println("Failed to send expired email: " + e.getMessage());
            }
        }

        LocalDate targetDate = LocalDate.now().plusDays(5);

        // 2. Create a range covering the ENTIRE day (00:00:00 to 23:59:59)
        LocalDateTime start = targetDate.atStartOfDay(); // 00:00:00
        LocalDateTime end = targetDate.atTime(LocalTime.MAX); // 23:59:59.999999
//        LocalDateTime start = LocalDateTime.now();
//        LocalDateTime end = LocalDateTime.now().plusMinutes(10);

        List<UserSubscription> expiringSoon = repository.findExpiringSoon(SubscriptionStatus.ACTIVE, start, end);

        for (UserSubscription sub : expiringSoon) {
            try {
                mailService.sendExpiryWarning(
                        sub.getUser().getEmail(),
                        sub.getUser().getFirstName(), // Personalization!
                        sub.getEndDate()
                );
                System.out.println("mail sent");
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }
    }

}
