package com.app.menex.subscription;

import com.app.menex.user.User;
import com.app.menex.user.UserService;
import com.stripe.exception.StripeException;
import com.stripe.model.Price;
import com.stripe.model.Subscription;
import com.stripe.model.SubscriptionItem;
import com.stripe.param.billingportal.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/subscription")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final UserService userService;
    @Value("${menex.frontendURL}")
    private String frontendURL;

    @PostMapping
    public ResponseEntity<String> createSubscription(@RequestBody SubscriptionRequest request) throws StripeException {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(subscriptionService.createSession(user, request));
    }

    @PostMapping("/create-portal-session/card")
    public ResponseEntity<Map<String, String>> createCardPortalSession() {
        User user = userService.getCurrentUser();
        try {

            String returnUrl = frontendURL + "/success";

            com.stripe.param.billingportal.SessionCreateParams params =
                    com.stripe.param.billingportal.SessionCreateParams.builder()
                            .setCustomer(user.getCustomerId())
                            .setReturnUrl(returnUrl)
                            .setFlowData(
                                    SessionCreateParams.FlowData.builder()
                                            .setType(SessionCreateParams.FlowData.Type.PAYMENT_METHOD_UPDATE)
                                            .build()
                            )
                            .build();

            com.stripe.model.billingportal.Session portalSession =
                    com.stripe.model.billingportal.Session.create(params);

            return ResponseEntity.ok(Collections.singletonMap("url", portalSession.getUrl()));
        } catch (StripeException e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/create-portal-session")
    public ResponseEntity<Map<String, String>> createPortalSession() {
        User user = userService.getCurrentUser();
        try {

            String returnUrl = frontendURL + "/success";

            com.stripe.param.billingportal.SessionCreateParams params =
                    com.stripe.param.billingportal.SessionCreateParams.builder()
                            .setCustomer(user.getCustomerId())
                            .setReturnUrl(returnUrl)
                            .build();

            com.stripe.model.billingportal.Session portalSession =
                    com.stripe.model.billingportal.Session.create(params);

            return ResponseEntity.ok(Collections.singletonMap("url", portalSession.getUrl()));
        } catch (StripeException e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("cancel")
    public ResponseEntity cancelSubscription() throws StripeException {
        User user = userService.getCurrentUser();
        subscriptionService.cancelUserSubscription(user.getCustomerId());
        System.out.println("subscription cancelled");
        return ResponseEntity.ok().build();
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        try {
            User user = userService.getCurrentUser();
            Subscription sub = subscriptionService.getSubscriptionDetails(user.getCustomerId());

            SubscriptionItem item = sub.getItems().getData().get(0);
            Price price = item.getPrice();
            Long priceInCent = price.getUnitAmount();
            double decimalAmount = priceInCent / 100.0;
            Map<String, Object> details = new HashMap<>();
            details.put("status", sub.getStatus()); // Will be "active" or "trialing"
            details.put("currentPeriodStart", sub.getCurrentPeriodStart());
            details.put("currentPeriodEnd", sub.getCurrentPeriodEnd());
            details.put("amount", decimalAmount);
            String interval = item.getPrice().getRecurring().getInterval();
            details.put("interval", interval);
            details.put("isScheduledForCancel", sub.getCancelAtPeriodEnd());

            if ("trialing".equals(sub.getStatus())) {
                details.put("isTrial", true);
                details.put("trialEndDate", sub.getTrialEnd()); // Unix timestamp when trial ends
            } else {
                details.put("isTrial", false);
                details.put("nextBillDate", sub.getCurrentPeriodEnd());
            }

            return ResponseEntity.ok(details);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Collections.singletonMap("error", "No subscription"));
        }
    }
}
