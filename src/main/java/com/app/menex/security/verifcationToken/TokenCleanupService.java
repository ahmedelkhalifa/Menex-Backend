package com.app.menex.security.verifcationToken;

import com.app.menex.user.UserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@Transactional
public class TokenCleanupService {

    private final VerificationTokenRepository tokenRepository;
    private final UserRepository userRepository;

    public TokenCleanupService(VerificationTokenRepository tokenRepository, UserRepository userRepository) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
    }

    // Run every day at midnight (00:00:00)
    @Scheduled(cron = "0 0 0 * * ?")
    public void removeExpiredTokens() {
        LocalDateTime now = LocalDateTime.now();
        tokenRepository.deleteExpiredTokens(now);
        userRepository.deleteUnverifiedUsers(now.minusHours(48));
    }
}