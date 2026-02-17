package com.app.menex.subscriptionStripe;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SubscriptionRequest {
    private String priceId;
    private String successUrl;
    private String cancelUrl;
}
