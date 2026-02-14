package com.app.menex.security.verifcationToken;

import com.app.menex.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    VerificationToken findByToken(String token);
    void deleteByUser(User user);

    @Modifying
    @Query("DELETE FROM VerificationToken t WHERE t.expiration <= ?1")
    void deleteExpiredTokens(LocalDateTime now);
}
