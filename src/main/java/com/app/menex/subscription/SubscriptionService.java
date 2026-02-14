package com.app.menex.subscription;

import com.app.menex.user.User;
import com.app.menex.user.UserRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.Subscription;
import com.stripe.model.SubscriptionCollection;
import com.stripe.model.checkout.Session;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.SubscriptionListParams;
import com.stripe.param.SubscriptionUpdateParams;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final UserRepository userRepository;

    public String createSession(User user, SubscriptionRequest request) throws StripeException {
        String customerId = user.getCustomerId();
        if (customerId == null) {
            CustomerCreateParams params = CustomerCreateParams.builder()
                    .setEmail(user.getEmail())
                    .setName(user.getFirstName() + " " + user.getLastName())
                    .build();
            Customer customer = Customer.create(params);
            customerId = customer.getId();
            user.setCustomerId(customerId);
            userRepository.save(user);
        }
        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .setCustomer(customerId)
                .setSuccessUrl(request.getSuccessUrl())
                .setCancelUrl(request.getCancelUrl())
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPrice(request.getPriceId())
                        .build())
                .setSubscriptionData(SessionCreateParams.SubscriptionData.builder()
                        .setTrialPeriodDays(30L)
                        .build())
                .build();
        Session session = Session.create(params);
        return session.getUrl();
    }
    public void cancelUserSubscription(String stripeCustomerId) throws StripeException {

        SubscriptionListParams listParams = SubscriptionListParams.builder()
                .setCustomer(stripeCustomerId)
                .build();

        SubscriptionCollection subscriptions = Subscription.list(listParams);

        if (subscriptions.getData().isEmpty()) {
            System.out.println("No subscriptions found for customer: " + stripeCustomerId);
            return;
        }

        for (Subscription subscription : subscriptions.getData()) {

            if (!subscription.getCancelAtPeriodEnd()) {
                SubscriptionUpdateParams params = SubscriptionUpdateParams.builder()
                        .setCancelAtPeriodEnd(true)
                        .build();

                subscription.update(params);
                System.out.println("Successfully scheduled cancellation for: " + subscription.getId());
            } else {
                System.out.println("Subscription " + subscription.getId() + " is already scheduled to cancel.");
            }
        }
    }

    public Subscription getSubscriptionDetails(String stripeCustomerId) throws StripeException {

        SubscriptionListParams params = SubscriptionListParams.builder()
                .setCustomer(stripeCustomerId)
                .setLimit(5L)
                .build();

        SubscriptionCollection subscriptions = Subscription.list(params);

        return subscriptions.getData().stream()
                .filter(sub -> "active".equals(sub.getStatus()) || "trialing".equals(sub.getStatus())
                        || "past_due".equals(sub.getStatus()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No valid subscription found"));
    }
}
