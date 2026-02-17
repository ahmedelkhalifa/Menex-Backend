package com.app.menex.payment.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SubscriptionDetails {
    private Long currentPeriodEnd;
    private Long subscriptionStart;
    private SubscriptionStatus status;
    private BigDecimal amount;
    private String interval;
}
