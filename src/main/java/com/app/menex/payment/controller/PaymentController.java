package com.app.menex.payment.controller;

import com.app.menex.payment.model.SubscribeRequest;
import com.app.menex.payment.model.SubscriptionDetails;
import com.app.menex.payment.service.PaymentService;
import com.app.menex.user.User;
import com.app.menex.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final UserService userService;

    @PostMapping("/activate")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> activateSubscription(@RequestBody SubscribeRequest request) {
        paymentService.subscribe(request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/revoke/{userId}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> revokeSubscription(@PathVariable Long userId ) {
        paymentService.unsubscribe(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/subscription")
    public ResponseEntity<SubscriptionDetails> getSubscriptionDetails() {
        User currentUser = userService.getCurrentUser();
        SubscriptionDetails dt = paymentService.getSubscriptionDetails(currentUser.getId());
        return ResponseEntity.ok(dt);
    }

    @GetMapping("/subscription/{userId}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<SubscriptionDetails> getSubscriptionDetails(@PathVariable Long userId) {
        SubscriptionDetails dt = paymentService.getSubscriptionDetailsAdmin(userId);
        return ResponseEntity.ok(dt);
    }

    @PutMapping("/renewal")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> renewSubscription(@RequestBody SubscribeRequest request) {
        paymentService.renewSubscription(request);
        return ResponseEntity.ok().build();
    }
}
