package com.app.menex.user;

import com.app.menex.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    List<User> findAllByRole(Role role);

    Optional<User> findByCustomerId(String customerId);

    @Modifying
    @Query("DELETE FROM User u WHERE u.enabled = false AND u.createdAt <= :cutoffDate")
    void deleteUnverifiedUsers(@Param("cutoffDate") LocalDateTime cutoffDate);
}
