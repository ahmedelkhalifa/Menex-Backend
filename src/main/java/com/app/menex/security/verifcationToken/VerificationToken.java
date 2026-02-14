package com.app.menex.security.verifcationToken;

import com.app.menex.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String token;
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
    @Builder.Default
    private LocalDateTime expiration =  LocalDateTime.now().plusDays(1);

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiration);
    }
}
