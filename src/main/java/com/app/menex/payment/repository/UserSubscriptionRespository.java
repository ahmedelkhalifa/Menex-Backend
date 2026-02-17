package com.app.menex.payment.repository;

import com.app.menex.payment.model.SubscriptionStatus;
import com.app.menex.payment.model.UserSubscription;
import com.app.menex.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserSubscriptionRespository extends JpaRepository<UserSubscription,Long> {

    Optional<UserSubscription> findTopByUserIdAndStatusOrderByEndDateDesc(Long userId, SubscriptionStatus status);

    Optional<UserSubscription> findTopByUserIdOrderByEndDateDesc(Long userId);

    // 1. Find subscriptions that are ACTIVE but past their End Date
    @Query("SELECT s FROM UserSubscription s WHERE s.status = :status AND s.endDate < :now")
    List<UserSubscription> findExpiredSubscriptions(@Param("status") SubscriptionStatus status, @Param("now") LocalDateTime now);

    // 2. Find subscriptions expiring exactly 5 days from now (ignoring time)
    // We use a range to be safe against execution time differences
    @Query("SELECT s FROM UserSubscription s WHERE s.status = :status AND s.endDate BETWEEN :start AND :end")
    List<UserSubscription> findExpiringSoon(@Param("status") SubscriptionStatus status,
                                            @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    void deleteByUser(User userToDelete);
}
