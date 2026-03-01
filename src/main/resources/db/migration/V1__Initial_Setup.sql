SET FOREIGN_KEY_CHECKS = 0;
-- Categories Table
CREATE TABLE `categories` (
                              `id` bigint NOT NULL AUTO_INCREMENT,
                              `name` varchar(255) NOT NULL,
                              `menu_id` bigint NOT NULL,
                              PRIMARY KEY (`id`),
                              KEY `FKrsqti0wi1nu5x6w97bv29sd98` (`menu_id`),
                              CONSTRAINT `FKrsqti0wi1nu5x6w97bv29sd98` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`)
);

-- Menu Items Table
CREATE TABLE `menu_items` (
                              `id` bigint NOT NULL AUTO_INCREMENT,
                              `available` bit(1) NOT NULL,
                              `description` varchar(500) DEFAULT NULL,
                              `image_url` varchar(255) DEFAULT NULL,
                              `name` varchar(255) NOT NULL,
                              `position` int DEFAULT NULL,
                              `price` decimal(38,2) NOT NULL,
                              `category_id` bigint NOT NULL,
                              `currency` enum('SDG','TL','USD') DEFAULT NULL,
                              PRIMARY KEY (`id`),
                              KEY `FK5bg0vbmql5ggu48n7d5pwgjg3` (`category_id`),
                              CONSTRAINT `FK5bg0vbmql5ggu48n7d5pwgjg3` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
);

-- Menus Table
CREATE TABLE `menus` (
                         `id` bigint NOT NULL AUTO_INCREMENT,
                         `active` bit(1) NOT NULL,
                         `name` varchar(255) NOT NULL,
                         `restaurant_id` bigint NOT NULL,
                         `description` text,
                         `image_url` varchar(255) DEFAULT NULL,
                         `views` int NOT NULL,
                         PRIMARY KEY (`id`),
                         KEY `FK49thmnytvo47ttv4ggtwo9rrj` (`restaurant_id`),
                         CONSTRAINT `FK49thmnytvo47ttv4ggtwo9rrj` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
);

-- Restaurants Table
CREATE TABLE `restaurants` (
                               `id` bigint NOT NULL AUTO_INCREMENT,
                               `name` varchar(255) NOT NULL,
                               `slug` varchar(255) NOT NULL,
                               `owner_id` bigint NOT NULL,
                               `theme_id` bigint DEFAULT NULL,
                               `address` varchar(255) NOT NULL,
                               `logo_url` varchar(255) DEFAULT NULL,
                               `phone` varchar(255) NOT NULL,
                               `views` int NOT NULL,
                               `description` varchar(255) DEFAULT NULL,
                               PRIMARY KEY (`id`),
                               UNIQUE KEY `UKbqfy5owwx6allqo3q7sfjk1il` (`slug`),
                               UNIQUE KEY `UK332s1g89fajnlbql160m3te6q` (`theme_id`),
                               KEY `FKp5mmmypepihvmkdb83qwugr4d` (`owner_id`),
                               CONSTRAINT `FK741sxyvg6aylfq6p0sktijqoe` FOREIGN KEY (`theme_id`) REFERENCES `themes` (`id`),
                               CONSTRAINT `FKp5mmmypepihvmkdb83qwugr4d` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`)
);

-- Subscriptions Table
CREATE TABLE `subscriptions` (
                                 `id` bigint NOT NULL AUTO_INCREMENT,
                                 `amount` decimal(38,2) NOT NULL,
                                 `end_date` datetime(6) NOT NULL,
                                 `billing_interval` varchar(255) NOT NULL,
                                 `start_date` datetime(6) NOT NULL,
                                 `status` enum('ACTIVE','CANCELLED') NOT NULL,
                                 `user_id` bigint NOT NULL,
                                 `plan` enum('ENTERPRISE','PRO','STARTER') NOT NULL,
                                 PRIMARY KEY (`id`),
                                 KEY `FKhro52ohfqfbay9774bev0qinr` (`user_id`),
                                 CONSTRAINT `FKhro52ohfqfbay9774bev0qinr` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);

-- Themes Table
CREATE TABLE `themes` (
                          `id` bigint NOT NULL AUTO_INCREMENT,
                          `font` varchar(255) DEFAULT NULL,
                          `primary_color` varchar(255) DEFAULT NULL,
                          `secondary_color` varchar(255) DEFAULT NULL,
                          `text_primary` varchar(255) DEFAULT NULL,
                          `text_secondary` varchar(255) DEFAULT NULL,
                          `background` varchar(255) DEFAULT NULL,
                          `background_card` varchar(255) DEFAULT NULL,
                          PRIMARY KEY (`id`)
);

-- Users Table
CREATE TABLE `users` (
                         `id` bigint NOT NULL AUTO_INCREMENT,
                         `created_at` datetime(6) NOT NULL,
                         `email` varchar(255) NOT NULL,
                         `first_name` varchar(255) NOT NULL,
                         `last_name` varchar(255) NOT NULL,
                         `password` varchar(255) NOT NULL,
                         `role` enum('RESTAURANT_OWNER','SUPER_ADMIN','UNSUBSCRIBER') NOT NULL,
                         `enabled` bit(1) NOT NULL,
                         `language` varchar(255) NOT NULL,
                         `customer_id` varchar(255) DEFAULT NULL,
                         PRIMARY KEY (`id`),
                         UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
);

-- Verification Token Table
CREATE TABLE `verification_token` (
                                      `id` bigint NOT NULL AUTO_INCREMENT,
                                      `expiration` datetime(6) DEFAULT NULL,
                                      `token` varchar(255) NOT NULL,
                                      `user_id` bigint DEFAULT NULL,
                                      PRIMARY KEY (`id`),
                                      UNIQUE KEY `UKq6jibbenp7o9v6tq178xg88hg` (`user_id`),
                                      CONSTRAINT `FK3asw9wnv76uxu3kr1ekq4i1ld` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);
SET FOREIGN_KEY_CHECKS = 1;