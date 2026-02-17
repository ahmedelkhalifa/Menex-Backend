package com.app.menex.subscriptionStripe;

import com.app.menex.enums.Role;
import com.app.menex.user.User;
import com.app.menex.user.UserRepository;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.*;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
public class WebhookController {

    @Value("${stripe.webhook.secret}")
    private String endpointSecret;

    private final UserRepository userRepository;

    @PostMapping("stripe")
    public ResponseEntity<String> handleStripeEvent(@RequestBody String payload,
                                                    @RequestHeader("Stripe-Signature") String sigHeader) {
        Event event;

        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (SignatureVerificationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Signature");
        }

        EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
        StripeObject stripeObject = null;

        // 1. Try Safe Deserialization
        if (dataObjectDeserializer.getObject().isPresent()) {
            stripeObject = dataObjectDeserializer.getObject().get();
        }
        // 2. Try Unsafe Deserialization
        else {
            try {
                stripeObject = dataObjectDeserializer.deserializeUnsafe();
            } catch (Exception e) {
                System.err.println("Failed to deserialize even with unsafe method");
                return ResponseEntity.status(HttpStatus.OK).build(); // Still return 200 so Stripe stops retrying
            }
        }

        if (stripeObject != null) {
            if ("checkout.session.completed".equals(event.getType())) {
                Session session = (Session) stripeObject;
                String customerId = session.getCustomer();

                User user = userRepository.findByCustomerId(customerId).orElseThrow(
                        () -> new EntityNotFoundException("No customer founded")
                );
                user.setRole(Role.RESTAURANT_OWNER);
                userRepository.save(user);
                System.out.println("Subscription created");
            }

            if ("customer.subscription.deleted".equals(event.getType())) {
                Subscription subscription = (Subscription) stripeObject;
                String customerId = subscription.getCustomer();

                User user = userRepository.findByCustomerId(customerId).orElseThrow(
                        () -> new EntityNotFoundException("No customer founded")
                );
                user.setRole(Role.UNSUBSCRIBER  );
                userRepository.save(user);
                System.out.println("Subscription deleted successfully");
            }

            if ("customer.subscription.updated".equals(event.getType())) {
                Subscription subscription = (Subscription) stripeObject;
                String customerId = subscription.getCustomer();

                userRepository.findByCustomerId(customerId).ifPresent(user -> {
                    if (subscription.getCancelAtPeriodEnd()) {
                        System.out.println("User " + user.getEmail() + " has scheduled a cancellation.");
                    } else {
                        user.setRole(Role.RESTAURANT_OWNER);
                    }
                    userRepository.save(user);
                });
            }
            if ("invoice.payment_failed".equals(event.getType())) {
                Invoice invoice =  (Invoice) stripeObject;

                String customer_id = invoice.getCustomer();

                User user = userRepository.findByCustomerId(customer_id).orElseThrow(
                        () -> new EntityNotFoundException("No customer founded")
                );
                System.out.println("email sent");
                // send email to the user
            }

        }

            return ResponseEntity.ok("");
        }
}